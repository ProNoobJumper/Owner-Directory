# Owner Directory

A Spring Boot backend for managing a local business directory.

## Quick Start

```bash
# Prerequisites
- Java 17+
- MongoDB running locally (or set MONGO_URI)
- Solr 9.x with 'owners' collection (or set SOLR_URL)

# Run
mvn spring-boot:run

# API docs
http://localhost:8080/swagger-ui.html
```

## Tech Stack

- **Spring Boot 3.2** - Web framework
- **MongoDB** - Primary data store  
- **Apache Solr** - Full-text search
- **Lombok** - Reduces boilerplate

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Controller  │ --> │   Service   │ --> │ Repository  │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          v
                    ┌─────────────┐
                    │    Solr     │
                    └─────────────┘
```

- **Controllers** - Handle HTTP, validation
- **Services** - Business logic, Mongo↔Solr sync
- **Repository** - MongoDB access via Spring Data

## Key Features

1. **CRUD for Owners** - Create, read, update, soft-delete
2. **Full-text Search** - Via Solr with prefix matching
3. **Image Uploads** - Magic byte validation, path traversal protection
4. **Rate Limiting** - 100 req/min per IP

## Known Limitations

- Mongo↔Solr sync is eventual (hourly reconciliation)
- Rate limiter is in-memory (doesn't work across multiple instances)
- No authentication (add Spring Security for prod)
- Search pagination total count is approximate

## Configuration

| Env Var | Default | Description |
|---------|---------|-------------|
| MONGO_URI | mongodb://localhost:27017/owner_directory | MongoDB connection |
| SOLR_URL | http://localhost:8983/solr | Solr base URL |
| UPLOAD_DIR | ./uploads | Image storage path |
| ALLOWED_ORIGINS | http://localhost:3000 | CORS origins |

## License

MIT
