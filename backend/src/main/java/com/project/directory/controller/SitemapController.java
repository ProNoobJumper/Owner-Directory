package com.project.directory.controller;

import com.project.directory.model.Owner;
import com.project.directory.repository.OwnerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Provides sitemap data for the frontend to generate sitemap.xml.
 * 
 * Returns all enabled owners with their slugs and last modified dates.
 * The frontend (Next.js) uses this to build the actual XML sitemap
 * that gets submitted to Google Search Console.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class SitemapController {

    private final OwnerRepository ownerRepository;

    // process sitemap in batches to avoid loading everything into memory at once
    private static final int BATCH_SIZE = 100;

    @Autowired
    public SitemapController(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    /**
     * Returns sitemap data for all enabled owners.
     * Frontend uses this to generate sitemap.xml for Google.
     */
    @GetMapping("/sitemap")
    public ResponseEntity<Map<String, Object>> getSitemap() {
        List<Map<String, String>> entries = new ArrayList<>();
        int page = 0;
        Page<Owner> batch;

        do {
            batch = ownerRepository.findByEnabledTrue(PageRequest.of(page, BATCH_SIZE));

            for (Owner owner : batch.getContent()) {
                // skip owners without slugs - they can't have SEO-friendly URLs
                if (owner.getSlug() == null || owner.getSlug().isBlank()) {
                    continue;
                }

                Map<String, String> entry = new HashMap<>();
                entry.put("slug", owner.getSlug());
                entry.put("name", owner.getName());
                entry.put("category", owner.getCategory());

                // last modified date for Google's freshness signals
                if (owner.getUpdatedAt() != null) {
                    entry.put("lastModified", owner.getUpdatedAt().toString());
                }

                entries.add(entry);
            }

            page++;
        } while (batch.hasNext());

        Map<String, Object> result = new HashMap<>();
        result.put("urls", entries);
        result.put("total", entries.size());

        log.debug("Sitemap generated with {} entries", entries.size());

        return ResponseEntity.ok(result);
    }
}
