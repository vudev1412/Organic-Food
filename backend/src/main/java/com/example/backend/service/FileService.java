package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService {
    @Value("${lehienvu.upload-file.base-uri}")
    private String baseURI;

    public void createDirectory(String folder) {
        Path path = Paths.get(folder);
        File tmpDir = path.toFile();

        if (!tmpDir.exists()) {
            try {
                Files.createDirectories(path);
                System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + folder);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
        }
    }

    public String store(MultipartFile file, String folder) throws IOException {
        String finalName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        Path path = Paths.get(baseURI + folder + "/" + finalName);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
        }

        return finalName;
    }
}