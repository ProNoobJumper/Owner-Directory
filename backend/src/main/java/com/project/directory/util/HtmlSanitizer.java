package com.project.directory.util;

import java.util.regex.Pattern;

/**
 * Simple HTML sanitizer. Strips tags that could be used for XSS.
 * 
 * For a real app I'd use OWASP Java HTML Sanitizer library,
 * but this covers the basics for our MVP.
 */
public final class HtmlSanitizer {

    private HtmlSanitizer() {
    }

    // matches <script>, <iframe>, <object>, <embed>, <form>, onclick=, onerror=,
    // etc
    private static final Pattern DANGEROUS_TAGS = Pattern.compile(
            "<\\s*(script|iframe|object|embed|form|link|meta|style)[^>]*>.*?</\\s*\\1\\s*>|" +
                    "<\\s*(script|iframe|object|embed|form|link|meta|style)[^>]*/?>|" +
                    "\\s*on\\w+\\s*=",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    // matches all HTML tags for complete strip
    private static final Pattern ALL_TAGS = Pattern.compile("<[^>]+>");

    /**
     * Removes dangerous HTML while preserving text content.
     * Use this for fields that might be displayed in HTML context.
     */
    public static String sanitize(String input) {
        if (input == null)
            return null;

        // Remove dangerous stuff first
        String clean = DANGEROUS_TAGS.matcher(input).replaceAll("");

        // Strip remaining tags
        clean = ALL_TAGS.matcher(clean).replaceAll("");

        // Decode common HTML entities that might be hiding stuff
        clean = clean.replace("&lt;", "<").replace("&gt;", ">")
                .replace("&#60;", "<").replace("&#62;", ">");

        // Re-strip after decoding (in case of double-encoding attacks)
        clean = DANGEROUS_TAGS.matcher(clean).replaceAll("");
        clean = ALL_TAGS.matcher(clean).replaceAll("");

        return clean.trim();
    }

    /**
     * Checks if input contains potentially dangerous content.
     */
    public static boolean containsDangerousContent(String input) {
        if (input == null)
            return false;
        return DANGEROUS_TAGS.matcher(input).find() || ALL_TAGS.matcher(input).find();
    }
}
