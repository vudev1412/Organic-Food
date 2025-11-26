package com.example.backend.controller;

import com.example.backend.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UploadController {
    @Value("${lehienvu.upload-file.base-uri}")
    private String baseURI;

    private final FileService fileService;

    // Upload 1 file - Chỉ trả về tên file
    @PostMapping("/files")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file,
                                         @RequestParam("folder") String folder) throws IOException {
        this.fileService.createDirectory(baseURI + folder);
        String savedFileName = this.fileService.store(file, folder);

        // Chỉ trả về tên file
        return ResponseEntity.ok(savedFileName);
    }

    // Upload nhiều file - Trả về danh sách tên file
    @PostMapping("/files/multiple")
    public ResponseEntity<List<String>> uploadMultiple(@RequestParam("files") MultipartFile[] files,
                                                       @RequestParam("folder") String folder) throws IOException {
        this.fileService.createDirectory(baseURI + folder);

        List<String> savedFileNames = new ArrayList<>();
        for (MultipartFile file : files) {
            String savedFileName = this.fileService.store(file, folder);
            savedFileNames.add(savedFileName);
        }

        return ResponseEntity.ok(savedFileNames);
    }
}
