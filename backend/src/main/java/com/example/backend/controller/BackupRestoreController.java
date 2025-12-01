package com.example.backend.controller;

import com.example.backend.service.BackupRestoreService;
import lombok.RequiredArgsConstructor;
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
import java.util.Map;

@RestController
@RequestMapping("/api/v1/db")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Nếu cần cho frontend React
public class BackupRestoreController {

    private final BackupRestoreService backupRestoreService;

    @PostMapping("/backup")
    public ResponseEntity<ApiResponse<BackupRestoreService.BackupInfo>> backup() {
        try {
            BackupRestoreService.BackupInfo info = backupRestoreService.backupDatabase();
            return ResponseEntity.ok(ApiResponse.success(info));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Backup thất bại: " + e.getMessage()));
        }
    }
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadBackup(@RequestParam String path) throws IOException {
        File file = new File(path);
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Trả thẳng Resource, KHÔNG bao ApiResponse
        Path filePath = file.toPath();
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(filePath));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getName() + "\"")
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }





    @PostMapping("/restore")
    public ResponseEntity<ApiResponse<String>> restore(@RequestParam String path) {
        try {
            backupRestoreService.restoreDatabase(path);
            return ResponseEntity.ok(
                    ApiResponse.success("Restore thành công từ: " + path)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Restore thất bại: " + e.getMessage()));
        }
    }
}
record BackupInfo(String absolutePath, long fileSize, String createdAt) {}

record ApiResponse<T>(
        boolean success,
        T data,
        String message
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, null, message);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }
}