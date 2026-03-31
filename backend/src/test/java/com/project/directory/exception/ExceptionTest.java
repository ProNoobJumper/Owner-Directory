package com.project.directory.exception;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for custom exceptions.
 * Verify message formatting.
 */
class ExceptionTest {

    @Test
    void validationException_simpleMessage() {
        ValidationException ex = new ValidationException("Invalid input");
        assertEquals("Invalid input", ex.getMessage());
    }

    @Test
    void validationException_fieldAndReason() {
        ValidationException ex = new ValidationException("email", "must be valid format");
        assertEquals("email: must be valid format", ex.getMessage());
    }

    @Test
    void concurrentModificationException_formatsMessage() {
        ConcurrentModificationException ex = new ConcurrentModificationException("Owner", "abc123");
        assertTrue(ex.getMessage().contains("Owner"));
        assertTrue(ex.getMessage().contains("abc123"));
        assertTrue(ex.getMessage().contains("modified by another request"));
    }

    @Test
    void searchServiceException_includesOperation() {
        SearchServiceException ex = new SearchServiceException("indexing", new RuntimeException("connection failed"));
        assertTrue(ex.getMessage().contains("indexing"));
        assertNotNull(ex.getCause());
    }

    @Test
    void resourceNotFoundException_formatsMessage() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Owner not found: xyz");
        assertTrue(ex.getMessage().contains("Owner not found"));
    }
}
