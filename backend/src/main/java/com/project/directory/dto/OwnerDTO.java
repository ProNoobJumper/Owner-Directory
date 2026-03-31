package com.project.directory.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

public class OwnerDTO {

    @Data
    public static class Request {
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name too long")
        private String name;

        @Size(max = 200, message = "Business name too long")
        private String businessName;

        @NotBlank(message = "Category is required")
        @Size(max = 50, message = "Category too long")
        private String category;

        @Size(max = 20, message = "Max 20 services")
        private List<@Size(max = 100) String> services;

        @Size(max = 2000, message = "Description too long")
        private String description;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
        private String phone;

        @Email(message = "Invalid email format")
        private String email;

        @Size(max = 500, message = "Address too long")
        private String address;

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City name too long")
        private String city;

        @Size(max = 100, message = "State too long")
        private String state;

        @Pattern(regexp = "^[0-9]{6}$", message = "PIN code must be exactly 6 digits")
        private String zipCode;

        @Size(max = 500, message = "Image URL too long")
        private String image;

        @Size(max = 500, message = "Image URL too long")
        private String imageUrl;

        @Size(max = 500, message = "Website URL too long")
        private String website;

        @Min(value = 0, message = "Rating must be at least 0")
        @Max(value = 5, message = "Rating cannot exceed 5")
        private double rating;

        @Min(value = 0, message = "Review count must be at least 0")
        private int reviewCount;

        // SEO fields - optional, frontend falls back to name/description if not set
        @Size(max = 60, message = "Meta title too long - max 60 chars for Google")
        private String metaTitle;

        @Size(max = 160, message = "Meta description too long - max 160 chars for Google")
        private String metaDescription;

        @Size(max = 500, message = "OG image URL too long")
        private String ogImage;

        private boolean enabled = true;
    }

    @Data
    public static class Response {
        private String id;
        private String name;
        private String businessName;
        private String slug;
        private String category;
        private List<String> services;
        private String description;
        private String phone;
        private String email;
        private String address;
        private String city;
        private String state;
        private String zipCode;
        private String image;
        private String imageUrl;
        private String website;
        private double rating;
        private int reviewCount;
        private String metaTitle;
        private String metaDescription;
        private String ogImage;
        private boolean enabled;
        private String createdAt;
    }
}
