package com.project.directory.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Adds cache headers to GET responses for better SEO performance.
 * Google ranks faster sites higher, and caching helps a lot with that.
 *
 * Kept it simple - different TTLs for different endpoints.
 * For a real CDN setup you'd want more granular control.
 */
@Component
@Order(2) // run after RateLimitFilter
public class CacheControlFilter implements Filter {

    // short cache for listings that change often
    private static final int LIST_CACHE_SECONDS = 60;

    // longer cache for individual owner pages - content doesn't change that often
    private static final int DETAIL_CACHE_SECONDS = 300; // 5 min

    // static assets can be cached longer
    private static final int STATIC_CACHE_SECONDS = 86400; // 1 day

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest httpRequest &&
                response instanceof HttpServletResponse httpResponse) {

            String method = httpRequest.getMethod();
            String path = httpRequest.getRequestURI();

            // only cache GET requests - mutations should never be cached
            if ("GET".equalsIgnoreCase(method)) {
                int ttl = getCacheTtl(path);
                if (ttl > 0) {
                    httpResponse.setHeader("Cache-Control", "public, max-age=" + ttl);
                } else {
                    // explicitly mark non-cacheable endpoints
                    httpResponse.setHeader("Cache-Control", "no-cache, no-store");
                }
            }
        }

        chain.doFilter(request, response);
    }

    // different TTLs based on what's being accessed
    private int getCacheTtl(String path) {
        if (path.startsWith("/uploads/")) {
            return STATIC_CACHE_SECONDS; // images don't change
        }
        if (path.matches("/api/owners/slug/.*") || path.matches("/api/owners/[a-f0-9]+")) {
            return DETAIL_CACHE_SECONDS; // individual owner pages
        }
        if (path.equals("/api/owners") || path.startsWith("/api/owners/search")) {
            return LIST_CACHE_SECONDS; // listings change more often
        }
        if (path.equals("/api/sitemap")) {
            return DETAIL_CACHE_SECONDS; // sitemap doesn't change that often
        }
        return 0; // don't cache anything else
    }
}
