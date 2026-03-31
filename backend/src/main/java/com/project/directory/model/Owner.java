package com.project.directory.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Owner entity representing a service provider in the directory.
 */
@Data
@Document(collection = "owners")
public class Owner {

    @Id
    private String id;

    @Indexed
    private String name;

    private String businessName;

    @Indexed
    private String slug; // URL-friendly version of name, e.g. "johns-plumbing"

    @Indexed
    private String category; // e.g., Plumber, Electrician

    private List<String> services;
    private String description;

    private String phone;
    private String email;
    private String address;

    @Indexed
    private String city;

    private String state;
    private String zipCode;

    private String image;
    private String imageUrl;

    private String website;
    private double rating;
    private int reviewCount;

    // SEO fields - frontend uses these for <title> and <meta description> tags
    private String metaTitle; // max 60 chars for Google
    private String metaDescription; // max 160 chars for Google

    // social media preview image - shown when link is shared on
    // Facebook/Twitter/etc
    private String ogImage;

    @Indexed
    private boolean enabled = true; // Default to enabled

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}
