package com.project.directory.service;

import com.project.directory.dto.OwnerDTO;
import com.project.directory.exception.ConcurrentModificationException;
import com.project.directory.exception.ResourceNotFoundException;
import com.project.directory.model.Owner;
import com.project.directory.repository.OwnerRepository;
import com.project.directory.util.HtmlSanitizer;
import com.project.directory.util.SlugUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Main service for owner operations.
 * 
 * This was the second file I wrote after getting the controller working.
 * The Solr sync stuff was added later when we needed search.
 */
@Slf4j
@Service
@SuppressWarnings("null")
public class OwnerService {

    // TODO: should refactor to use constructor injection everywhere
    // but @Autowired on constructor works fine and is cleaner than field injection
    private final OwnerRepository ownerRepository;
    private final SolrService solrService;

    @Autowired
    public OwnerService(OwnerRepository ownerRepository, SolrService solrService) {
        this.ownerRepository = ownerRepository;
        this.solrService = solrService;
    }

    /**
     * Creates a new owner listing.
     * Text fields are sanitized to prevent XSS when displayed on frontend.
     * 
     * @param req the owner details
     * @return the created owner with generated ID
     */
    public Owner createOwner(OwnerDTO.Request req) {
        Owner owner = new Owner();
        BeanUtils.copyProperties(req, owner);

        // sanitize user-provided text to prevent stored XSS
        sanitizeOwnerFields(owner);

        // generate SEO-friendly slug from name
        generateSlug(owner);

        owner.setCreatedAt(LocalDateTime.now());
        owner.setUpdatedAt(LocalDateTime.now());

        Owner saved = ownerRepository.save(owner);

        // async - if solr fails, reconciliation job will fix it later
        solrService.indexOwner(saved);

        return saved;
    }

    /**
     * Fetches a single owner by ID.
     * 
     * @throws ResourceNotFoundException if owner doesn't exist
     */
    public Owner getOwnerById(String id) {
        return ownerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + id));
    }

    /**
     * Fetches owner by slug - used for SEO-friendly URLs.
     * Frontend calls this with the slug from the URL path.
     *
     * @throws ResourceNotFoundException if no owner with that slug
     */
    public Owner getOwnerBySlug(String slug) {
        return ownerRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + slug));
    }

    /**
     * Lists all enabled owners with pagination.
     */
    public Page<Owner> getAllOwners(Pageable pageable) {
        return ownerRepository.findByEnabledTrue(pageable);
    }

    /**
     * Shows all owners including disabled - for admin dashboard
     */
    public Page<Owner> getAllOwnersAdmin(Pageable pageable) {
        return ownerRepository.findAll(pageable);
    }

    /**
     * Updates an existing owner.
     * 
     * @throws ResourceNotFoundException       if owner doesn't exist
     * @throws ConcurrentModificationException if owner was modified by another
     *                                         request
     */
    public Owner updateOwner(String id, OwnerDTO.Request req) {
        Owner existing = getOwnerById(id);

        try {
            // careful - dont overwrite internal fields
            BeanUtils.copyProperties(req, existing, "id", "slug", "createdAt", "version");
            sanitizeOwnerFields(existing);

            // regenerate slug if name changed
            generateSlug(existing);

            existing.setUpdatedAt(LocalDateTime.now());

            Owner saved = ownerRepository.save(existing);
            solrService.indexOwner(saved);
            return saved;

        } catch (org.springframework.dao.OptimisticLockingFailureException ex) {
            // had this happen once during load testing - two people editing same record
            log.warn("Concurrent modification for owner {}", id);
            throw new ConcurrentModificationException("Owner", id);
        }
    }

    // soft delete - PM said we might need to recover data later
    // plus avoids issues if we add reviews that reference owners
    public void deleteOwner(String id) {
        Owner owner = getOwnerById(id);
        owner.setEnabled(false);
        owner.setUpdatedAt(LocalDateTime.now());

        ownerRepository.save(owner);
        solrService.indexOwner(owner);

        // DEBUG: uncomment to see deletes in logs
        // log.info("Soft deleted owner: {}", id);
    }

    /**
     * Search via Solr then fetch from Mongo.
     * Falls back to MongoDB directly if Solr returns no results.
     */
    public Page<Owner> searchOwners(String keyword, String category, Pageable pageable) {
        List<String> ids = solrService.searchOwners(keyword, category,
                pageable.getPageNumber(), pageable.getPageSize());

        if (ids.isEmpty()) {
            // Solr returned nothing - fall back to MongoDB search
            return searchViaMongoFallback(keyword, category, pageable);
        }

        List<Owner> owners = (List<Owner>) ownerRepository.findAllById(ids);

        // filter out disabled in case solr is stale
        List<Owner> results = owners.stream()
                .filter(Owner::isEnabled)
                .collect(Collectors.toList());

        return new PageImpl<>(results, pageable, results.size());
    }

    /**
     * MongoDB fallback when Solr is unavailable or returns empty.
     */
    private Page<Owner> searchViaMongoFallback(String keyword, String category, Pageable pageable) {
        boolean hasKeyword = keyword != null && !keyword.isBlank();
        boolean hasCategory = category != null && !category.isBlank();

        // Escape regex special characters in the keyword
        String safeKeyword = hasKeyword
                ? java.util.regex.Pattern.quote(keyword.trim())
                : null;

        if (hasKeyword && hasCategory) {
            return ownerRepository.searchByKeywordAndCategory(safeKeyword, category, pageable);
        } else if (hasKeyword) {
            return ownerRepository.searchByKeyword(safeKeyword, pageable);
        } else if (hasCategory) {
            return ownerRepository.findByEnabledTrueAndCategory(category, pageable);
        } else {
            return ownerRepository.findByEnabledTrue(pageable);
        }
    }

    /**
     * Strips potentially dangerous HTML from user-provided text fields.
     * Prevents stored XSS attacks.
     */
    private void sanitizeOwnerFields(Owner owner) {
        owner.setName(HtmlSanitizer.sanitize(owner.getName()));
        owner.setBusinessName(HtmlSanitizer.sanitize(owner.getBusinessName()));
        owner.setDescription(HtmlSanitizer.sanitize(owner.getDescription()));
        owner.setAddress(HtmlSanitizer.sanitize(owner.getAddress()));
        owner.setWebsite(HtmlSanitizer.sanitize(owner.getWebsite()));

        // sanitize each service name too
        if (owner.getServices() != null) {
            List<String> cleanServices = owner.getServices().stream()
                    .map(HtmlSanitizer::sanitize)
                    .collect(Collectors.toList());
            owner.setServices(cleanServices);
        }

        // sanitize SEO fields too - these get rendered in HTML <head>
        owner.setMetaTitle(HtmlSanitizer.sanitize(owner.getMetaTitle()));
        owner.setMetaDescription(HtmlSanitizer.sanitize(owner.getMetaDescription()));
    }

    // generates slug from owner name, handles duplicates
    // called on every create/update so slugs stay in sync with names
    private void generateSlug(Owner owner) {
        String slug = SlugUtil.toSlug(owner.getName());

        if (slug.isEmpty()) {
            return; // shouldn't happen since name is @NotBlank, but just in case
        }

        // check for duplicates - skip if this owner already has this slug
        if (!slug.equals(owner.getSlug()) && ownerRepository.existsBySlug(slug)) {
            slug = SlugUtil.makeUnique(slug);
            log.debug("Slug collision, using: {}", slug);
        }

        owner.setSlug(slug);
    }
}
