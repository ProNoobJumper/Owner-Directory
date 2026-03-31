package com.project.directory.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple rate limiter - 100 req/min per IP.
 * Good enough for MVP, use Bucket4j or similar for production.
 */
@Slf4j
@Component
public class RateLimitFilter implements Filter {

    private final ConcurrentHashMap<String, HitCounter> counters = new ConcurrentHashMap<>();

    // 100 requests per minute seems reasonable for a directory site
    private static final int MAX_REQUESTS = 100;

    // Clean up old entries when map gets too big (prevents memory leak)
    private static final int CLEANUP_THRESHOLD = 10000;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest httpRequest) {
            String ip = extractClientIp(httpRequest);

            // Housekeeping - don't let the map grow forever
            if (counters.size() > CLEANUP_THRESHOLD) {
                cleanupStaleEntries();
            }

            if (isOverLimit(ip)) {
                HttpServletResponse httpResponse = (HttpServletResponse) response;
                httpResponse.setStatus(429);
                httpResponse.getWriter().write("Slow down! Too many requests.");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private String extractClientIp(HttpServletRequest request) {
        // SECURITY: Only trust X-Forwarded-For if we're behind a proxy
        // Set TRUST_PROXY=true in production when behind nginx/cloudflare
        // Otherwise attacker can spoof their IP and bypass rate limit
        boolean trustProxy = Boolean.parseBoolean(
                System.getenv().getOrDefault("TRUST_PROXY", "false"));

        if (trustProxy) {
            String xff = request.getHeader("X-Forwarded-For");
            if (xff != null && !xff.isBlank()) {
                // Take the rightmost untrusted IP, not leftmost (which can be spoofed)
                // This assumes one trusted proxy. For multiple, need more complex logic.
                String[] parts = xff.split(",");
                return parts[parts.length - 1].trim();
            }
        }
        return request.getRemoteAddr();
    }

    private boolean isOverLimit(String ip) {
        long currentMinute = System.currentTimeMillis() / 60000;

        HitCounter counter = counters.compute(ip, (key, existing) -> {
            if (existing == null || existing.minute != currentMinute) {
                return new HitCounter(currentMinute);
            }
            existing.hits.incrementAndGet();
            return existing;
        });

        if (counter.hits.get() > MAX_REQUESTS) {
            log.warn("Rate limit hit for: {}", ip);
            return true;
        }
        return false;
    }

    private void cleanupStaleEntries() {
        long currentMinute = System.currentTimeMillis() / 60000;
        int before = counters.size();

        // Remove anything older than 5 minutes
        counters.entrySet().removeIf(e -> e.getValue().minute < currentMinute - 5);

        log.info("Cleaned up rate limit cache: {} -> {} entries", before, counters.size());
    }

    // Simple hit counter per minute slot
    private static class HitCounter {
        final long minute;
        final AtomicInteger hits;

        HitCounter(long minute) {
            this.minute = minute;
            this.hits = new AtomicInteger(1);
        }
    }
}
