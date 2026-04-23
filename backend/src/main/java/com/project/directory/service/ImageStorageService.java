package com.project.directory.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.directory.exception.FileStorageException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Slf4j
@Service
public class ImageStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final Cloudinary cloudinary;

    public ImageStorageService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    public String storeFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("File too big - max 5MB");
        }

        try {
            if (!isValidImage(file)) {
                throw new FileStorageException("Not a valid image. Only PNG, JPEG, or GIF accepted.");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "bgs-owners", "resource_type", "image"));

            String url = (String) result.get("secure_url");
            log.debug("Uploaded to Cloudinary: {}", url);
            return url;

        } catch (IOException e) {
            log.error("Cloudinary upload failed", e);
            throw new FileStorageException("Upload failed, try again", e);
        }
    }

    private boolean isValidImage(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[8];
            int bytesRead = is.read(header);
            if (bytesRead < 4) return false;

            // JPEG
            if (header[0] == (byte) 0xFF && header[1] == (byte) 0xD8 && header[2] == (byte) 0xFF) return true;
            // PNG
            if (header[0] == (byte) 0x89 && header[1] == (byte) 0x50 &&
                    header[2] == (byte) 0x4E && header[3] == (byte) 0x47) return true;
            // GIF
            if (header[0] == (byte) 0x47 && header[1] == (byte) 0x49 &&
                    header[2] == (byte) 0x46 && header[3] == (byte) 0x38) return true;

            return false;
        }
    }
}
