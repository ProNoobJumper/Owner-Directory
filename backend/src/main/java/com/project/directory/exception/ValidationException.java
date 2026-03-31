package com.project.directory.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when input data fails validation beyond what @Valid catches.
 * Use this for business logic validation failures.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String field, String reason) {
        super(field + ": " + reason);
    }
}
