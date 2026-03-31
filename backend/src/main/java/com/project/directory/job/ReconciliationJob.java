package com.project.directory.job;

import com.project.directory.model.Owner;
import com.project.directory.repository.OwnerRepository;
import com.project.directory.service.SolrService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Fixes Mongo/Solr drift by re-indexing all owners hourly.
 * Not elegant but reliable. Better than having stale search results.
 */
@Slf4j
@Component
public class ReconciliationJob {

    private final OwnerRepository ownerRepo;
    private final SolrService solr;

    // Process in batches to avoid OOM on large datasets
    private static final int BATCH_SIZE = 100;

    // Arbitrary safety limit - bump this if we ever have more than 100k owners
    private static final int MAX_BATCHES = 1000;

    @Autowired
    public ReconciliationJob(OwnerRepository ownerRepo, SolrService solr) {
        this.ownerRepo = ownerRepo;
        this.solr = solr;
    }

    @Scheduled(fixedRate = 3600000) // Every hour
    public void syncMongoToSolr() {
        log.info("Starting hourly reconciliation...");

        int page = 0;
        long indexed = 0;
        Page<Owner> batch;

        do {
            batch = ownerRepo.findAll(PageRequest.of(page, BATCH_SIZE));

            for (Owner owner : batch.getContent()) {
                // Index ALL owners - Solr query filters by enabled:true
                // This fixes bug where disabled owners stayed searchable
                solr.indexOwner(owner);
                indexed++;
            }

            page++;

            // Prevent runaway loop in case of bugs
            if (page >= MAX_BATCHES) {
                log.warn("Hit safety limit at {} batches, stopping", MAX_BATCHES);
                break;
            }

        } while (batch.hasNext());

        log.info("Reconciliation done. Re-indexed {} owners.", indexed);
    }
}
