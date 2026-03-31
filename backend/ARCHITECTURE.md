# Architecture Overview

Simple Spring Boot monolith. Nothing fancy.

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP Requests                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    RateLimitFilter                          │
│        (100 req/min per IP, in-memory counter)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    OwnerController                          │
│        CRUD endpoints + search + image upload               │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│      OwnerService       │     │    ImageStorageService      │
│  (business logic)       │     │  (file handling + security) │
└─────────────────────────┘     └─────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│    OwnerRepository      │     │      Local Filesystem       │
│    (Spring Data Mongo)  │     │      (./uploads folder)     │
└─────────────────────────┘     └─────────────────────────────┘
              │
              ├─────────────────────────────────┐
              ▼                                 ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│        MongoDB          │     │         SolrService         │
│   (primary data store)  │     │    (async, eventual sync)   │
└─────────────────────────┘     └─────────────────────────────┘
                                              │
                                              ▼
                                ┌─────────────────────────────┐
                                │       Apache Solr           │
                                │    (full-text search)       │
                                └─────────────────────────────┘
```

## Design Decisions

### Why MongoDB + Solr?

I chose MongoDB because:
- Schema flexibility for evolving MVP requirements
- Simple document model matches Owner entity well
- Spring Data makes it trivial

I added Solr (not Elasticsearch) because:
- Lightweight for small scale
- Better prefix matching out of the box
- I've used it before (familiarity matters)

### Why Eventual Consistency?

Mongo is source of truth. Solr is just a search index.

```
Write → MongoDB → (async) → Solr
                    ↑
        ReconciliationJob (hourly)
```

If Solr fails, we retry 3x with exponential backoff. If still fails, the hourly
reconciliation job resyncs everything.

**Tradeoff**: Search results may be stale by up to 10 seconds (commitWithin) or
up to 1 hour if the async index fails entirely.

For a business directory, this is acceptable. Users won't notice if a new plumber
takes 10 seconds to appear in search.

### Why Soft Delete?

```java
owner.setEnabled(false);  // Instead of ownerRepository.delete(owner)
```

Reasons:
1. Accidental deletes can be recovered
2. Historical data preserved for analytics
3. No foreign key issues (if we add reviews later)
4. Solr index just filters by `enabled:true`

### Why In-Memory Rate Limiting?

Simple `ConcurrentHashMap<IP, HitCounter>` that tracks requests per minute.

**Known limitation**: Doesn't work across multiple server instances. If we scale
horizontally, we'd need Redis or similar.

For MVP on single instance? Good enough.

### File Upload Security

```
User uploads evil.jpg → Check magic bytes → Actually a PNG → Save as UUID.png
```

Key security measures:
1. Magic byte validation (not trusting file extension)
2. Forced extension from actual content
3. UUID filename (prevents enumeration)
4. Path traversal protection
5. Size limit (5MB)

## Layer Responsibilities

| Layer | Responsibility | Example |
|-------|----------------|---------|
| Controller | HTTP handling, validation, response building | `OwnerController` |
| Service | Business logic, orchestration, Solr sync | `OwnerService` |
| Repository | Data access | `OwnerRepository` |
| Config | Infrastructure setup | `SolrConfig`, `RateLimitFilter` |
| Exception | Error handling | `GlobalExceptionHandler` |

## What I'd Change for Production

1. **Rate limiting** → Move to Redis or API Gateway
2. **Auth** → Add Spring Security + JWT
3. **Search** → Consider Elasticsearch for scale
4. **File storage** → Move to S3 or similar
5. **Monitoring** → Add more actuator endpoints + Prometheus
6. **Caching** → Add Redis cache for frequently accessed owners
