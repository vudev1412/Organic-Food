package com.example.backend.controller;

import com.example.backend.service.BackupRestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/db")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Nếu cần cho frontend React
public class BackupRestoreController {

    private final BackupRestoreService backupRestoreService;

    @PostMapping("/backup")
    public ResponseEntity<ApiResponse<BackupInfo>> backup(@RequestParam String path) {
        try {
            String filePath = backupRestoreService.backupDatabase(path);

            // Lấy thông tin file
            File file = new File(filePath);
            BackupInfo info = new BackupInfo(
                    file.getAbsolutePath(),
                    file.length(),
                    new java.util.Date().toString()
            );

            return ResponseEntity.ok(
                    ApiResponse.success(info)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Backup thất bại: " + e.getMessage()));
        }
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