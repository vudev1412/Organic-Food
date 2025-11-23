package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api")
public class UploadController {

    @Value("${lehienvu.upload-file.images}")
    private String basePath;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Không có file được gửi lên");
        }

        try {
            // ✅ Dùng Path thay vì File (modern way)
            Path uploadPath = Paths.get(basePath).toAbsolutePath().normalize();

            // Tạo folder nếu chưa tồn tại
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file duy nhất
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return ResponseEntity.badRequest().body("Tên file không hợp lệ");
            }

            String filename = System.currentTimeMillis() + "_" + originalFilename;
            Path targetPath = uploadPath.resolve(filename);

            // ✅ Dùng Files.copy (an toàn hơn transferTo)
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("✅ File saved: " + targetPath.toString());

            // ✅ Trả về chỉ tên file (không phải full URL)
            return ResponseEntity.ok(filename);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi lưu file: " + e.getMessage());
        }
    }
}