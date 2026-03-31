package com.project.directory.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Catches exceptions and returns clean error responses.
 * Logs the nasty details internally but keeps API responses friendly.
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> notFound(ResourceNotFoundException ex) {
        log.debug("Not found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(errorBody(ex.getMessage(), 404));
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<?> fileError(FileStorageException ex) {
        log.warn("File issue: {}", ex.getMessage());
        return ResponseEntity
                .badRequest()
                .body(errorBody(ex.getMessage(), 400));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validationError(MethodArgumentNotValidException ex) {
        // Return field-level errors for form validation
        Map<String, String> errors = new HashMap<>();
        for (FieldError err : ex.getBindingResult().getFieldErrors()) {
            errors.put(err.getField(), err.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> runtimeError(RuntimeException ex) {
        // Check for our conflict exception (optimistic locking)
        if (ex.getMessage() != null && ex.getMessage().contains("Conflict")) {
            log.info("Optimistic lock conflict");
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(errorBody("Record was modified - please refresh and try again", 409));
        }

        // Fall through to generic handler
        return unexpectedError(ex);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> unexpectedError(Exception ex) {
        // Log the full stack trace but don't leak it to the client
        log.error("Unexpected error: ", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody("Something went wrong. Please try again later.", 500));
    }

    private Map<String, Object> errorBody(String message, int status) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status);
        body.put("message", message);
        return body;
    }
}
