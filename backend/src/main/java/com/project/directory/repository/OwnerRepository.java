package com.project.directory.repository;

import com.project.directory.model.Owner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends MongoRepository<Owner, String> {

    // Find all enabled owners
    Page<Owner> findByEnabledTrue(Pageable pageable);

    // Find by slug - for SEO-friendly URLs
    java.util.Optional<Owner> findBySlug(String slug);

    // Check if slug already taken
    boolean existsBySlug(String slug);

    // Find all owners (admin use)
    @NonNull
    Page<Owner> findAll(@NonNull Pageable pageable);

    // MongoDB fallback search - used when Solr is unavailable
    @org.springframework.data.mongodb.repository.Query("{ 'enabled': true, '$or': [ " +
            "{ 'name': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'businessName': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'category': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'city': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'services': { '$regex': ?0, '$options': 'i' } } ] }")
    Page<Owner> searchByKeyword(String keyword, Pageable pageable);

    // MongoDB fallback search with category filter
    @org.springframework.data.mongodb.repository.Query("{ 'enabled': true, 'category': ?1, '$or': [ " +
            "{ 'name': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'businessName': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'category': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'city': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'services': { '$regex': ?0, '$options': 'i' } } ] }")
    Page<Owner> searchByKeywordAndCategory(String keyword, String category, Pageable pageable);

    // MongoDB fallback - filter by category only
    Page<Owner> findByEnabledTrueAndCategory(String category, Pageable pageable);
}
