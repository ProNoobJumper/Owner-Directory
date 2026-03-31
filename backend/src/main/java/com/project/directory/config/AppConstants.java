package com.project.directory.config;

/**
 * App-wide constants. Easier to find than hunting through code.
 * 
 * I tried using application.yml for all of these but some things
 * (like collection names) are easier as constants.
 */
public final class AppConstants {

    private AppConstants() {
    } // prevent instantiation

    // --- Solr ---
    public static final String SOLR_COLLECTION = "owners";
    public static final int SOLR_COMMIT_WITHIN_MS = 10000;
    public static final int SOLR_MAX_RETRIES = 3;

    // --- Pagination ---
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;

    // --- Rate Limiting ---
    public static final int RATE_LIMIT_REQUESTS_PER_MINUTE = 100;
    public static final int RATE_LIMIT_CLEANUP_THRESHOLD = 10000;

    // --- File Upload ---
    public static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    public static final int MAX_FILENAME_LENGTH = 255;

    // --- Validation ---
    public static final int MAX_NAME_LENGTH = 100;
    public static final int MAX_DESCRIPTION_LENGTH = 2000;
    public static final int MAX_SERVICES_COUNT = 20;
    public static final int MAX_SERVICE_NAME_LENGTH = 100;

    // --- Reconciliation ---
    public static final int RECONCILIATION_BATCH_SIZE = 100;
    public static final int RECONCILIATION_MAX_BATCHES = 1000; // safety limit
}
