package com.example.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Controller riêng cho download - KHÔNG bị wrap bởi RestResponse
 * Đặt ở package khác hoặc exclude khỏi ResponseBodyAdvice
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/files")
@CrossOrigin(origins = "*")
public class FileDownloadController {

    @GetMapping("/backup/download")
    public ResponseEntity<Resource> downloadBackup(@RequestParam String path) throws IOException {
        log.info("🔽 Downloading backup file: {}", path);

        File file = new File(path);

        // Kiểm tra file tồn tại
        if (!file.exists()) {
            log.warn("❌ Backup file not found: {}", path);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Kiểm tra security: chỉ cho phép download file .sql
        if (!file.getName().endsWith(".sql")) {
            log.warn("❌ Invalid file type (not .sql): {}", path);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Kiểm tra file phải trong thư mục backup
        String userHome = System.getProperty("user.home");
        String backupDir = userHome + File.separator + "backups";
        if (!file.getAbsolutePath().startsWith(backupDir)) {
            log.warn("❌ File outside backup directory: {}", path);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Path filePath = file.toPath();
            ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(filePath));

            log.info("✅ Download successful: {} ({} bytes)", file.getName(), file.length());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + file.getName() + "\"")
                    .contentLength(file.length())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (IOException e) {
            log.error("❌ Error reading file: {}", path, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}