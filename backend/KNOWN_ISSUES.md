# Known Issues

Honest list of limitations and bugs I'm aware of.

## Functional Issues

### Search Results Order Not Preserved

**Problem**: When we search in Solr and get back IDs, then fetch from MongoDB, the order isn't preserved.

```java
List<String> ids = solr.searchOwners(...);  // Returns [id1, id2, id3] by relevance
List<Owner> owners = ownerRepo.findAllById(ids);  // Returns in arbitrary order!
```

**Impact**: Search relevance is lost. The most relevant result might appear last.

**Workaround**: Would need to manually reorder after fetching from Mongo.

**Status**: Known, not fixed. Low priority for MVP.

---

### Pagination Total Count is Wrong

**Problem**: Search endpoint returns `PageImpl` with `filtered.size()` as total count.

```java
return new PageImpl<>(filtered, pageable, filtered.size());  // Wrong!
```

**Impact**: Frontend can't show "Page 1 of 27" correctly.

**Workaround**: Would need to extract numFound from Solr response.

**Status**: Known, not fixed. Documented as HACK in code.

---

### Mongo and Solr Can Drift

**Problem**: If Solr indexing fails after Mongo save, they're out of sync.

**Current mitigation**:
1. Retry 3x with exponential backoff
2. Hourly reconciliation job re-syncs everything

**Remaining risk**: Up to 1 hour of stale search data if all retries fail.

---

## Security Limitations

### No Authentication

**Problem**: All endpoints are public. Anyone can delete any owner.

**Current mitigation**: None.

**Status**: Must fix before production. See TODO.md.

---

### Rate Limiter is Per-Instance

**Problem**: Uses in-memory `ConcurrentHashMap`. If we run 3 servers, each has its own counter.

**Impact**: Attacker could get 300 req/min by hitting all 3 servers.

**Workaround**: Use Redis-backed rate limiter.

**Status**: Acceptable for single-instance MVP.

---

## Operational Issues

### No Health Check for Solr

**Problem**: Actuator health doesn't check if Solr is reachable.

**Impact**: App reports healthy even if search is broken.

**Workaround**: Add custom health indicator.

---

### Logs Don't Include Request ID

**Problem**: Can't correlate logs across a single request.

**Impact**: Debugging production issues is harder.

**Workaround**: Add MDC-based request ID logging.

---

## Performance Issues

### Reconciliation Job Re-Indexes Everything

**Problem**: Every hour, we iterate ALL owners and re-index.

**Impact**: O(n) even if only 1 owner changed.

**Workaround**: Track last indexed timestamp, only re-index changed records.

**Status**: Acceptable for <10k owners. Will hit scaling issues beyond that.

---

## Won't Fix (By Design)

### System.out Removed

The DataLoader originally used `System.out.println`. Replaced with logger for consistency.

### Soft Delete Only

We don't actually delete data. `DELETE /api/owners/{id}` just sets `enabled=false`.
This is intentional for data recovery purposes.
