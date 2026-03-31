package com.project.directory.config;

/**
 * Application-wide constants.
 * Centralizes magic strings for maintainability.
 */
public final class Constants {

    private Constants() {
        // Prevent instantiation
    }

    // Solr Configuration
    public static final String SOLR_COLLECTION = "owners";
    public static final int SOLR_COMMIT_WITHIN_MS = 10000;
    public static final int SOLR_MAX_RETRIES = 3;

    // Rate Limiting
    public static final int RATE_LIMIT_MAX_REQUESTS = 100;
    public static final int RATE_LIMIT_CLEANUP_THRESHOLD = 10000;

    // File Upload
    public static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Reconciliation
    public static final int RECONCILIATION_PAGE_SIZE = 100;
    public static final int RECONCILIATION_MAX_PAGES = 1000;
}
