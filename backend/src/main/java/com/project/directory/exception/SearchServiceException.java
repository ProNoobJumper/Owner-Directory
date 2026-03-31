package com.project.directory.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when Solr operations fail after retries.
 * The caller should handle this gracefully - search is non-critical.
 */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class SearchServiceException extends RuntimeException {

    public SearchServiceException(String operation, Throwable cause) {
        super("Search service unavailable during: " + operation, cause);
    }

    public SearchServiceException(String message) {
        super(message);
    }
}
