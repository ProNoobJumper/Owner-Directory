package com.project.directory.service;

import com.project.directory.model.Owner;
import lombok.extern.slf4j.Slf4j;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Solr integration for search.
 * 
 * This took me a while to get right. The SolrJ docs aren't great.
 * Originally tried using Spring Data Solr but it's deprecated, so
 * went with raw SolrJ instead.
 */
@Slf4j
@Service
@SuppressWarnings("null")
public class SolrService {

    private final SolrClient client;

    private static final String COLLECTION = "owners";

    // might want to make these configurable later, but fine for now
    private static final int MAX_RETRIES = 3;
    private static final int COMMIT_WITHIN = 10000; // 10 sec

    @Autowired
    public SolrService(SolrClient client) {
        this.client = client;
    }

    /**
     * Index owner async with retry.
     * If all retries fail, the hourly reconcilliation job catches it.
     */
    @Async
    public void indexOwner(Owner owner) {
        for (int i = 1; i <= MAX_RETRIES; i++) {
            try {
                SolrInputDocument doc = new SolrInputDocument();
                doc.addField("id", owner.getId());
                doc.addField("name", owner.getName());
                doc.addField("businessName", owner.getBusinessName());
                doc.addField("category", owner.getCategory());
                doc.addField("services", owner.getServices());
                doc.addField("description", owner.getDescription());
                doc.addField("city", owner.getCity());
                doc.addField("state", owner.getState());
                doc.addField("enabled", owner.isEnabled());

                // experimented with commit() vs commitWithin, commitWithin is better for
                // batching
                client.add(COLLECTION, doc, COMMIT_WITHIN);
                log.debug("indexed: {}", owner.getId());
                return; // success

            } catch (Exception e) {
                log.warn("Solr index fail (try {}/{}): {} - {}",
                        i, MAX_RETRIES, owner.getId(), e.getMessage());

                if (i < MAX_RETRIES) {
                    sleep(1000 * i); // backoff: 1s, 2s, 3s
                }
            }
        }

        // all retries exhausted
        log.error("SOLR INDEX FAILED after {} retries: {}", MAX_RETRIES, owner.getId());
    }

    // helper to avoid repeating try-catch for Thread.sleep everywhere
    private void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }
    }

    @Async
    public void deleteOwner(String id) {
        try {
            client.deleteById(COLLECTION, id, COMMIT_WITHIN);
            log.debug("deleted from index: {}", id);
        } catch (Exception e) {
            // TODO: should add retry here too for consistency
            // but deletes are less critical than adds
            log.error("Solr delete fail: {}", id, e);
        }
    }

    /**
     * Search owners. Returns just IDs, caller fetches from Mongo.
     * 
     * This was tricky to get right. Spent a lot of time figuring out
     * the query syntax. The escaping is important for security.
     */
    public List<String> searchOwners(String keyword, String category, int page, int size) {
        SolrQuery q = new SolrQuery();

        if (keyword != null && !keyword.isBlank()) {
            // truncate super long keywords (attack prevention)
            String kw = keyword.length() > 200 ? keyword.substring(0, 200) : keyword;
            String escaped = ClientUtils.escapeQueryChars(kw);

            // prefix search across multiple fields
            // OLD: was using DisMax but this is simpler
            q.setQuery(String.format(
                    "name:%s* OR businessName:%s* OR category:%s* OR services:%s* OR city:%s*",
                    escaped, escaped, escaped, escaped, escaped));
        } else {
            q.setQuery("*:*");
        }

        if (category != null && !category.isBlank()) {
            q.addFilterQuery("category:" + ClientUtils.escapeQueryChars(category));
        }

        q.addFilterQuery("enabled:true");
        q.setStart(page * size);
        q.setRows(size);

        try {
            QueryResponse resp = client.query(COLLECTION, q);
            return resp.getResults().stream()
                    .map(doc -> (String) doc.getFieldValue("id"))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("search failed: {}", e.getMessage());
            // return empty instead of throwing - search shouldn't break the app
            return Collections.emptyList();
        }
    }
}
