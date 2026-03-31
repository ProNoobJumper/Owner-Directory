package com.project.directory.service;

import com.project.directory.exception.FileStorageException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

// NOTE: this was rushed before the first demo. Cleaned up security stuff later
// after Ravi pointed out the path traversal issue in code review
@Slf4j
@Service
@SuppressWarnings("null")
public class ImageStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private Path storageDir;

    // 5MB - client specifically asked for this limit
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Old approach - was checking extension, bad idea
    // private static final Set<String> ALLOWED_EXT = Set.of(".jpg", ".png",
    // ".gif");

    @PostConstruct
    public void init() {
        this.storageDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageDir);
            log.info("Upload folder ready: {}", this.storageDir);
        } catch (Exception e) {
            // this shouldn't happen in prod but just in case
            throw new FileStorageException("Couldn't create upload folder", e);
        }
    }

    /**
     * Stores uploaded image. Security was added after initial version.
     * Changed to check magic bytes instead of extension after security review.
     */
    public String storeFile(MultipartFile file) {
        String originalName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // path traversal fix - added after Ravi's code review
            if (originalName.contains("..") || originalName.contains("/") || originalName.contains("\\")) {
                log.warn("Sketchy filename rejected: {}", originalName);
                throw new FileStorageException("Invalid filename");
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                throw new FileStorageException("File too big - max 5MB");
            }

            String ext = detectImageType(file);
            if (ext == null) {
                throw new FileStorageException("Not a valid image. We only accept PNG, JPEG, or GIF.");
            }

            String newFilename = UUID.randomUUID() + ext;
            Path dest = this.storageDir.resolve(newFilename);

            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

            // was log.info before, changed to debug to reduce noise
            log.debug("Saved {} -> {}", originalName, newFilename);

            return newFilename;

        } catch (IOException e) {
            log.error("Failed saving file: {}", originalName, e);
            throw new FileStorageException("Upload failed, try again", e);
        }
    }

    // checks actual file content, not the extension which can be faked
    private String detectImageType(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[8];
            int bytesRead = is.read(header);

            if (bytesRead < 4)
                return null;

            // jpeg
            if (header[0] == (byte) 0xFF && header[1] == (byte) 0xD8 && header[2] == (byte) 0xFF) {
                return ".jpg";
            }

            // png - the 89 50 4E 47 bytes spell out the PNG ascii header
            if (header[0] == (byte) 0x89 && header[1] == (byte) 0x50 &&
                    header[2] == (byte) 0x4E && header[3] == (byte) 0x47) {
                return ".png";
            }

            // gif
            if (header[0] == (byte) 0x47 && header[1] == (byte) 0x49 &&
                    header[2] == (byte) 0x46 && header[3] == (byte) 0x38) {
                return ".gif";
            }

            // TODO: add webp? users keep asking about it
            return null;
        }
    }

    // added this after realising we needed to serve files too, not just store
    public Path loadFile(String filename) {
        String clean = filename
                .replace("/", "")
                .replace("\\", "")
                .replace("..", "");

        Path filePath = this.storageDir.resolve(clean).normalize();

        if (!filePath.startsWith(this.storageDir)) {
            log.warn("path traversal attempt: {}", filename);
            throw new FileStorageException("Invalid path");
        }

        return filePath;
    }
}
