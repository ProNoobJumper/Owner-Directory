package com.project.directory.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * Generates URL-friendly slugs from names.
 * 
 * Keeps it simple - regex based, no external library.
 * Handles unicode, special chars, and multiple spaces.
 */
public final class SlugUtil {

    private SlugUtil() {
    }

    // strips anything that's not alphanumeric or hyphen
    private static final Pattern NON_SLUG = Pattern.compile("[^a-z0-9-]");
    private static final Pattern MULTI_HYPHENS = Pattern.compile("-{2,}");

    /**
     * Converts a name to a URL-friendly slug.
     * "John's Plumbing & Co." -> "johns-plumbing-co"
     * "Safe Spark Electric" -> "safe-spark-electric"
     */
    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        // normalize unicode (café -> cafe)
        String slug = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");

        slug = slug.toLowerCase().trim();

        // replace spaces and common separators with hyphens
        slug = slug.replace(' ', '-')
                .replace('_', '-');

        // strip everything else
        slug = NON_SLUG.matcher(slug).replaceAll("");

        // collapse multiple hyphens into one
        slug = MULTI_HYPHENS.matcher(slug).replaceAll("-");

        // trim leading/trailing hyphens
        slug = slug.replaceAll("^-+|-+$", "");

        return slug;
    }

    /**
     * Makes a slug unique by appending a short suffix.
     * Used when there's already an owner with the same slug.
     */
    public static String makeUnique(String slug) {
        // append last 4 chars of current time millis - good enough for avoiding
        // collisions
        String suffix = String.valueOf(System.currentTimeMillis() % 10000);
        return slug + "-" + suffix;
    }
}
