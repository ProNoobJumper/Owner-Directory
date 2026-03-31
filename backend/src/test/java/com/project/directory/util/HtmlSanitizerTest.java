package com.project.directory.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for HTML sanitizer.
 * Focus on XSS attack vectors.
 */
class HtmlSanitizerTest {

    @Test
    void sanitize_nullInput_returnsNull() {
        assertNull(HtmlSanitizer.sanitize(null));
    }

    @Test
    void sanitize_plainText_unchanged() {
        String input = "John's Plumbing & Electric";
        assertEquals(input, HtmlSanitizer.sanitize(input));
    }

    @Test
    void sanitize_scriptTag_removed() {
        String input = "Hello<script>alert('xss')</script>World";
        String result = HtmlSanitizer.sanitize(input);

        assertFalse(result.contains("<script>"));
        assertFalse(result.contains("alert"));
        assertTrue(result.contains("Hello"));
        assertTrue(result.contains("World"));
    }

    @Test
    void sanitize_iframeTag_removed() {
        String input = "Test<iframe src='evil.com'></iframe>Text";
        String result = HtmlSanitizer.sanitize(input);

        assertFalse(result.contains("<iframe"));
        assertTrue(result.contains("Test"));
    }

    @Test
    void sanitize_onclickAttribute_removed() {
        String input = "<div onclick=\"evil()\">Click me</div>";
        String result = HtmlSanitizer.sanitize(input);

        assertFalse(result.contains("onclick"));
        assertFalse(result.toLowerCase().contains("<div"));
    }

    @Test
    void sanitize_encodedScript_removed() {
        // Double-encoding attack
        String input = "&lt;script&gt;alert('xss')&lt;/script&gt;";
        String result = HtmlSanitizer.sanitize(input);

        assertFalse(result.contains("<script>"));
    }

    @Test
    void containsDangerousContent_safeInput_returnsFalse() {
        assertFalse(HtmlSanitizer.containsDangerousContent("Safe text here"));
    }

    @Test
    void containsDangerousContent_scriptTag_returnsTrue() {
        assertTrue(HtmlSanitizer.containsDangerousContent("<script>bad</script>"));
    }
}
