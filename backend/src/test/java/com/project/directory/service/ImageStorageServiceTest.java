package com.project.directory.service;

import com.project.directory.exception.FileStorageException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ImageStorageService.
 * Focuses on security validations.
 */
@SuppressWarnings("null")
class ImageStorageServiceTest {

        private ImageStorageService imageStorageService;

        @TempDir
        Path tempDir;

        @BeforeEach
        void setUp() {
                imageStorageService = new ImageStorageService();
                ReflectionTestUtils.setField(imageStorageService, "uploadDir", tempDir.toString());
                imageStorageService.init();
        }

        @Test
        @DisplayName("loadFile should sanitize path traversal attempts")
        void loadFile_PathTraversal_ShouldSanitize() {
                // The service sanitizes the filename by removing dangerous characters
                Path result = imageStorageService.loadFile("../../../etc/passwd");

                // Assert: path traversal sequences are removed
                assertNotNull(result);
                assertFalse(result.toString().contains(".."));
        }

        @Test
        @DisplayName("loadFile should sanitize backslash traversal")
        void loadFile_BackslashTraversal_ShouldSanitize() {
                // The service sanitizes backslash paths too
                Path result = imageStorageService.loadFile("..\\..\\windows\\system32\\config");

                // Assert: backslashes and traversal are removed
                assertNotNull(result);
                assertFalse(result.toString().contains(".."));
        }

        @Test
        @DisplayName("loadFile should accept valid filename")
        void loadFile_ValidFilename_ShouldReturnPath() {
                // Act
                Path result = imageStorageService.loadFile("valid-image.jpg");

                // Assert
                assertNotNull(result);
                assertTrue(result.toString().contains("valid-image.jpg"));
        }

        @Test
        @DisplayName("storeFile should reject non-image files")
        void storeFile_InvalidMagicBytes_ShouldThrowException() {
                // Arrange - file with text content, not image
                MockMultipartFile textFile = new MockMultipartFile(
                                "file", "test.jpg", "image/jpeg", "this is not an image".getBytes());

                // Act & Assert
                FileStorageException exception = assertThrows(FileStorageException.class,
                                () -> imageStorageService.storeFile(textFile));
                assertTrue(exception.getMessage().contains("Not a valid image"));
        }

        @Test
        @DisplayName("storeFile should accept valid JPEG file")
        void storeFile_ValidJpeg_ShouldReturnFilename() {
                // Arrange - JPEG magic bytes (FF D8 FF E0)
                byte[] jpegContent = new byte[] {
                                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0,
                                0x00, 0x10, 0x4A, 0x46
                };
                MockMultipartFile jpegFile = new MockMultipartFile(
                                "file", "test.jpg", "image/jpeg", jpegContent);

                // Act
                String result = imageStorageService.storeFile(jpegFile);

                // Assert
                assertNotNull(result);
                assertTrue(result.endsWith(".jpg"), "Result should end with .jpg but was: " + result);
        }

        @Test
        @DisplayName("storeFile should accept valid PNG file")
        void storeFile_ValidPng_ShouldReturnFilename() {
                // Arrange - PNG magic bytes (89 50 4E 47)
                byte[] pngContent = new byte[] {
                                (byte) 0x89, (byte) 0x50, (byte) 0x4E, (byte) 0x47,
                                0x0D, 0x0A, 0x1A, 0x0A
                };
                MockMultipartFile pngFile = new MockMultipartFile(
                                "file", "test.png", "image/png", pngContent);

                // Act
                String result = imageStorageService.storeFile(pngFile);

                // Assert
                assertNotNull(result);
                assertTrue(result.endsWith(".png"));
        }

        @Test
        @DisplayName("storeFile should force extension from magic bytes, not filename")
        void storeFile_ShouldForceExtensionFromMagicBytes() {
                // Arrange - JPEG magic bytes but .html extension (attack attempt)
                byte[] jpegContent = new byte[] {
                                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0,
                                0x00, 0x10, 0x4A, 0x46
                };
                MockMultipartFile attackFile = new MockMultipartFile(
                                "file", "malicious.html", "text/html", jpegContent);

                // Act
                String result = imageStorageService.storeFile(attackFile);

                // Assert - should be .jpg, not .html
                assertTrue(result.endsWith(".jpg"), "Extension should be forced to .jpg");
                assertFalse(result.endsWith(".html"), "Extension should NOT be .html");
        }

        @Test
        @DisplayName("storeFile should reject files with path traversal in filename")
        void storeFile_FilenameWithTraversal_ShouldThrowException() {
                // Arrange
                byte[] jpegContent = new byte[] {
                                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0,
                                0x00, 0x10, 0x4A, 0x46
                };
                MockMultipartFile attackFile = new MockMultipartFile(
                                "file", "../../../evil.jpg", "image/jpeg", jpegContent);

                // Act & Assert
                assertThrows(FileStorageException.class,
                                () -> imageStorageService.storeFile(attackFile));
        }
}
