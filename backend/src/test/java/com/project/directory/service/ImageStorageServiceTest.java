package com.project.directory.service;

import com.project.directory.exception.FileStorageException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.*;

class ImageStorageServiceTest {

    private ImageStorageService imageStorageService;

    @BeforeEach
    void setUp() {
        // Cloudinary calls are made at upload time, not construction time,
        // so we can construct with dummy credentials for unit tests that don't call storeFile.
        imageStorageService = new ImageStorageService("test-cloud", "test-key", "test-secret");
    }

    @Test
    @DisplayName("storeFile should reject non-image files")
    void storeFile_InvalidMagicBytes_ShouldThrowException() {
        MockMultipartFile textFile = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "this is not an image".getBytes());

        FileStorageException exception = assertThrows(FileStorageException.class,
                () -> imageStorageService.storeFile(textFile));
        assertTrue(exception.getMessage().contains("Not a valid image"));
    }

    @Test
    @DisplayName("storeFile should reject files over 5MB")
    void storeFile_TooLarge_ShouldThrowException() {
        byte[] big = new byte[6 * 1024 * 1024];
        MockMultipartFile largeFile = new MockMultipartFile(
                "file", "big.jpg", "image/jpeg", big);

        FileStorageException exception = assertThrows(FileStorageException.class,
                () -> imageStorageService.storeFile(largeFile));
        assertTrue(exception.getMessage().contains("too big"));
    }
}
