package com.example.backend.controller;

import com.example.backend.service.BackupRestoreService;
import lombok.RequiredArgsConstructor;
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
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/db")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BackupRestoreController {

    private final BackupRestoreService backupRestoreService;

    // ⚠️ ĐẶT API LIST TRƯỚC, TRÁNH CONFLICT VỚI /backup
    @GetMapping("/backups/list")
    public ResponseEntity<ApiResponse<List<BackupRestoreService.BackupInfo>>> listBackups() {
        try {
            log.info("Fetching backup list...");
            List<BackupRestoreService.BackupInfo> backups = backupRestoreService.listBackups();
            log.info("Found {} backups", backups.size());
            return ResponseEntity.ok(ApiResponse.success(backups));
        } catch (Exception e) {
            log.error("Error listing backups", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Không thể lấy danh sách backup: " + e.getMessage()));
        }
    }

    @PostMapping("/backup/create")
    public ResponseEntity<ApiResponse<BackupRestoreService.BackupInfo>> backup() {
        try {
            log.info("Creating backup...");
            BackupRestoreService.BackupInfo info = backupRestoreService.backupDatabase();
            log.info("Backup created: {}", info.fileName());
            return ResponseEntity.ok(ApiResponse.success(info));
        } catch (Exception e) {
            log.error("Backup failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Backup thất bại: " + e.getMessage()));
        }
    }

    @DeleteMapping("/backup/delete")
    public ResponseEntity<ApiResponse<String>> deleteBackup(@RequestParam String path) {
        try {
            log.info("Deleting backup: {}", path);
            boolean deleted = backupRestoreService.deleteBackup(path);
            if (deleted) {
                log.info("Backup deleted successfully");
                return ResponseEntity.ok(ApiResponse.success("Đã xóa backup thành công"));
            } else {
                log.warn("Backup file not found: {}", path);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("File không tồn tại"));
            }
        } catch (Exception e) {
            log.error("Delete failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Xóa thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/restore")
    public ResponseEntity<ApiResponse<String>> restore(@RequestParam String path) {
        try {
            log.info("Restoring from: {}", path);
            backupRestoreService.restoreDatabase(path);
            log.info("Restore completed successfully");
            return ResponseEntity.ok(
                    ApiResponse.success("Restore thành công từ: " + path)
            );
        } catch (Exception e) {
            log.error("Restore failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Restore thất bại: " + e.getMessage()));
        }
    }
}

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