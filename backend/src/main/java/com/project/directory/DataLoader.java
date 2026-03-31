package com.project.directory;

import com.project.directory.model.Owner;
import com.project.directory.repository.OwnerRepository;
import com.project.directory.service.SolrService;
import com.project.directory.util.SlugUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds the database with sample data on startup.
 * Only runs if the database is empty.
 * Also backfills slugs for existing owners that don't have one.
 */
@Slf4j
@Component
@SuppressWarnings("null")
public class DataLoader implements CommandLineRunner {

    @Autowired
    private OwnerRepository ownerRepo;

    @Autowired
    private SolrService solr;

    @Override
    public void run(String... args) {
        // backfill slugs for existing owners that don't have one
        // needed after adding slug field to existing data
        migrateExistingSlugs();

        if (ownerRepo.count() > 0) {
            log.debug("Database already has data, skipping seed");
            return;
        }

        log.info("Seeding sample data...");

        // Sample plumber
        Owner plumber = new Owner();
        plumber.setName("John's Plumbing");
        plumber.setCategory("Plumbing");
        plumber.setServices(Arrays.asList("Leak Fix", "Pipe Installation", "Drain Cleaning"));
        plumber.setDescription("Best plumber in town with 20 years experience.");
        plumber.setPhone("9876543210");
        plumber.setEmail("john@plumbing.com");
        plumber.setCity("Mumbai");
        plumber.setAddress("45 MG Road, Andheri West");
        plumber.setEnabled(true);
        plumber.setSlug("johns-plumbing");
        plumber.setCreatedAt(LocalDateTime.now());
        plumber.setUpdatedAt(LocalDateTime.now());

        // Sample electrician
        Owner electrician = new Owner();
        electrician.setName("Safe Spark Electric");
        electrician.setCategory("Electrician");
        electrician.setServices(Arrays.asList("Wiring", "Lighting", "Panel Upgrade"));
        electrician.setDescription("Licensed professionals for all your electrical needs.");
        electrician.setPhone("9123456789");
        electrician.setEmail("contact@safespark.com");
        electrician.setCity("Delhi");
        electrician.setAddress("12 Connaught Place");
        electrician.setEnabled(true);
        electrician.setSlug("safe-spark-electric");
        electrician.setCreatedAt(LocalDateTime.now());
        electrician.setUpdatedAt(LocalDateTime.now());

        // Save to Mongo
        List<Owner> saved = ownerRepo.saveAll(Arrays.asList(plumber, electrician));

        // Index in Solr
        for (Owner owner : saved) {
            solr.indexOwner(owner);
        }

        log.info("Seeded {} sample owners", saved.size());
    }

    // one-time migration - generates slugs for owners that existed before we added
    // the slug field
    private void migrateExistingSlugs() {
        List<Owner> all = ownerRepo.findAll();
        int migrated = 0;

        for (Owner owner : all) {
            if (owner.getSlug() == null || owner.getSlug().isBlank()) {
                String slug = SlugUtil.toSlug(owner.getName());

                // handle duplicates
                if (ownerRepo.existsBySlug(slug)) {
                    slug = SlugUtil.makeUnique(slug);
                }

                owner.setSlug(slug);
                ownerRepo.save(owner);
                migrated++;
            }
        }

        if (migrated > 0) {
            log.info("Migrated {} owners with missing slugs", migrated);
        }
    }
}
