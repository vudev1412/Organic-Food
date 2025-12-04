package com.example.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BackupRestoreService {

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    private String getBackupDirectory() {
        String userHome = System.getProperty("user.home");
        return userHome + File.separator + "backups";
    }

    private String extractDbName() {
        String url = dbUrl.split("\\?")[0];
        return url.substring(url.lastIndexOf("/") + 1);
    }

    private String findExecutable(String... candidates) {
        for (String cmd : candidates) {
            try {
                ProcessBuilder pb = new ProcessBuilder(cmd, "--version");
                pb.start();
                log.info("Found executable in PATH: {}", cmd);
                return cmd;
            } catch (Exception ignored) {}
        }

        String[] paths = {
                "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
                "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe",
                "C:\\Program Files (x86)\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
                "C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysqldump.exe",
                "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe",
                "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysql.exe",
                "C:\\Program Files (x86)\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe",
                "/usr/bin/mysqldump", "/usr/local/bin/mysqldump", "/opt/homebrew/bin/mysqldump",
                "/usr/bin/mysql", "/usr/local/bin/mysql", "/opt/homebrew/bin/mysql"
        };

        for (String path : paths) {
            if (Files.exists(Paths.get(path))) {
                log.info("Found executable at: {}", path);
                return path;
            }
        }

        throw new RuntimeException("Không tìm thấy mysqldump/mysql.exe. Vui lòng cài MySQL client!");
    }

    public BackupInfo backupDatabase() {
        String backupDir = getBackupDirectory();
        File folder = new File(backupDir);
        if (!folder.exists()) folder.mkdirs();

        String timestamp = new java.text.SimpleDateFormat("yyyyMMdd_HHmmss")
                .format(new java.util.Date());
        String backupFile = backupDir + File.separator + "backup_" + timestamp + ".sql";

        String dbName = extractDbName();
        String mysqldump = findExecutable("mysqldump", "mysqldump.exe");

        List<String> command = List.of(
                mysqldump,
                "--user=" + dbUser,
                "--password=" + dbPassword,
                "--add-drop-table",
                "--routines",
                "--triggers",
                "--single-transaction",
                "--default-character-set=utf8mb4",
                "--result-file=" + backupFile,
                dbName
        );

        executeCommand(command, "Backup", backupFile);

        File file = new File(backupFile);
        return new BackupInfo(
                backupFile,
                file.getName(),
                file.length(),
                new java.util.Date().toString()
        );
    }

    // API mới: Lấy danh sách tất cả backup files
    public List<BackupInfo> listBackups() {
        String backupDir = getBackupDirectory();
        File folder = new File(backupDir);

        if (!folder.exists() || !folder.isDirectory()) {
            return new ArrayList<>();
        }

        File[] files = folder.listFiles((dir, name) -> name.startsWith("backup_") && name.endsWith(".sql"));

        if (files == null || files.length == 0) {
            return new ArrayList<>();
        }

        return Arrays.stream(files)
                .map(file -> {
                    try {
                        BasicFileAttributes attrs = Files.readAttributes(
                                file.toPath(), BasicFileAttributes.class);
                        return new BackupInfo(
                                file.getAbsolutePath(),
                                file.getName(),
                                file.length(),
                                attrs.creationTime().toString()
                        );
                    } catch (Exception e) {
                        log.error("Error reading file attributes: {}", file.getName(), e);
                        return null;
                    }
                })
                .filter(info -> info != null)
                .sorted(Comparator.comparing(BackupInfo::createdAt).reversed())
                .collect(Collectors.toList());
    }

    // API mới: Xóa file backup
    public boolean deleteBackup(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (!path.toFile().getName().startsWith("backup_")) {
                throw new RuntimeException("Chỉ có thể xóa file backup!");
            }
            return Files.deleteIfExists(path);
        } catch (Exception e) {
            log.error("Error deleting backup file: {}", filePath, e);
            throw new RuntimeException("Không thể xóa file: " + e.getMessage());
        }
    }

    public String restoreDatabase(String backupFilePath) {
        Path filePath = Paths.get(backupFilePath);
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File backup không tồn tại: " + backupFilePath);
        }

        String dbName = extractDbName();
        String mysql = findExecutable("mysql", "mysql.exe");

        List<String> command = new ArrayList<>();
        command.add(mysql);
        command.add("--user=" + dbUser);
        command.add("--password=" + dbPassword);
        command.add("--host=localhost");
        command.add("--port=3306");
        command.add("--default-character-set=utf8mb4");
        command.add("--force");
        command.add(dbName);

        return executeCommandWithInputFile(command, backupFilePath, "Restore");
    }

    private String executeCommand(List<String> command, String action, String filePath) {
        try {
            log.info("{} database → {}", action, filePath);
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            String output = new String(process.getInputStream().readAllBytes());
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                log.info("{} thành công: {}", action, filePath);
                return filePath;
            } else {
                String err = output.isEmpty() ? "No output" : output.trim();
                log.error("{} thất bại (code {}): {}", action, exitCode, err);
                throw new RuntimeException(action + " thất bại: " + err);
            }
        } catch (Exception e) {
            log.error("{} lỗi: ", action, e);
            throw new RuntimeException(action + " thất bại: " + e.getMessage());
        }
    }

    private String executeCommandWithInputFile(List<String> command, String inputFile, String action) {
        try {
            log.info("{} database từ file: {}", action, inputFile);
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            pb.redirectInput(new File(inputFile));
            Process process = pb.start();

            String output = new String(process.getInputStream().readAllBytes());
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                log.info("{} thành công từ file: {}", action, inputFile);
                return inputFile;
            } else {
                String err = output.isEmpty() ? "Unknown error" : output.trim();
                log.error("{} thất bại (code {}): {}", action, exitCode, err);
                throw new RuntimeException(action + " thất bại: " + err);
            }
        } catch (Exception e) {
            log.error("{} lỗi: ", action, e);
            throw new RuntimeException(action + " thất bại: " + e.getMessage());
        }
    }

    public record BackupInfo(
            String absolutePath,
            String fileName,
            long fileSize,
            String createdAt
    ) {}
}