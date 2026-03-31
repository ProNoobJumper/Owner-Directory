package com.project.directory.controller;

import com.project.directory.dto.OwnerDTO;
import com.project.directory.model.Owner;
import com.project.directory.service.ImageStorageService;
import com.project.directory.service.OwnerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

// main REST controller - this was the first file I created
// no doc because I kept meaning to add it and never did lol
@RestController
@RequestMapping("/api/owners") // was just /owners originally, added /api prefix later
@CrossOrigin(origins = "${app.cors.allowed-origins}")
@SuppressWarnings("null")
public class OwnerController {

    private final OwnerService ownerService;
    private final ImageStorageService imageService;

    @Autowired
    public OwnerController(OwnerService ownerService, ImageStorageService imageService) {
        this.ownerService = ownerService;
        this.imageService = imageService;
    }

    @PostMapping
    public ResponseEntity<Owner> create(@Valid @RequestBody OwnerDTO.Request request) {
        Owner created = ownerService.createOwner(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Owner> getById(@PathVariable String id) {
        return ResponseEntity.ok(ownerService.getOwnerById(id));
    }

    // SEO-friendly lookup - frontend uses this with URL slugs
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Owner> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ownerService.getOwnerBySlug(slug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Owner> update(
            @PathVariable String id,
            @Valid @RequestBody OwnerDTO.Request request) {
        return ResponseEntity.ok(ownerService.updateOwner(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        ownerService.deleteOwner(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<Owner>> list(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ownerService.getAllOwners(pageable));
    }

    // renamed from /find to /search after initial release
    @GetMapping("/search")
    public ResponseEntity<Page<Owner>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ownerService.searchOwners(query, category, pageable));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String filename = imageService.storeFile(file);

        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(filename)
                .toUriString();

        return ResponseEntity.ok(url);
    }
}
