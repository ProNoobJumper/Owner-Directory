# TODO

Things I know need work but haven't gotten to yet.

## High Priority

- [ ] **Add authentication** - Currently anyone can edit/delete owners. Need JWT + roles.
- [ ] **Email validation** - We accept any string as email. Should validate format at minimum.
- [ ] **Phone validation** - Same problem. No format validation.

## Medium Priority

- [ ] **Replace hand-rolled retry with Spring Retry** - The while-loop in SolrService works but it's not elegant. Spring Retry would be cleaner.
- [ ] **Add WEBP support** - detectImageType() only handles PNG/JPEG/GIF. WEBP is becoming common.
- [ ] **Fix search pagination total count** - Currently returns list size as total, not actual numFound from Solr.
- [ ] **Add integration tests** - Only have unit tests. Should test actual Mongo/Solr integration.

## Low Priority

- [ ] **Use constants for collection names** - "owners" is hardcoded in multiple places.
- [ ] **Add request logging** - Would help with debugging. Maybe a filter that logs request/response.
- [ ] **Externalize file size limit** - 5MB is hardcoded. Should be in application.yml.
- [ ] **Add rate limit headers** - Return X-RateLimit-Remaining so clients know their quota.

## Tech Debt

- [ ] **ReconciliationJob is naive** - Re-indexes everything every hour. Should track what changed.
- [ ] **Delete from Solr doesn't retry** - indexOwner retries 3x but deleteOwner doesn't. Not consistent.
- [ ] **Rate limiter memory cleanup** - Only cleans up when map exceeds 10k entries. Could be more proactive.

## If I Had More Time

- [ ] Add Redis caching for getOwnerById
- [ ] Move file storage to S3
- [ ] Add Swagger request/response examples
- [ ] Add performance benchmarks
- [ ] Add health check for Solr connectivity
