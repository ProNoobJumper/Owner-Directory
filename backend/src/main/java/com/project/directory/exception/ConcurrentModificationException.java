package com.project.directory.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when trying to modify a resource that was simultaneously modified by
 * another request.
 * This wraps Spring's OptimisticLockingFailureException with a cleaner API.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class ConcurrentModificationException extends RuntimeException {

    public ConcurrentModificationException(String resourceType, String id) {
        super(resourceType + " " + id + " was modified by another request. Please refresh and try again.");
    }
}
