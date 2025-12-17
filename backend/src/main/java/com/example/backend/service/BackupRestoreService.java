package com.example.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.*;
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

    /* ===================== COMMON ===================== */

    private String getBackupDirectory() {
        return System.getProperty("user.home") + File.separator + "backups";
    }

    private String extractDbName() {
        String url = dbUrl.split("\\?")[0];
        return url.substring(url.lastIndexOf("/") + 1);
    }

    /* ===================== EXECUTABLE ===================== */

    private String findMysqlDump() {
        return findExecutableExact(
                "mysqldump",
                "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
                "/usr/bin/mysqldump",
                "/usr/local/bin/mysqldump",
                "/opt/homebrew/bin/mysqldump"
        );
    }

    private String findMysql() {
        return findExecutableExact(
                "mysql",
                "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe",
                "/usr/bin/mysql",
                "/usr/local/bin/mysql",
                "/opt/homebrew/bin/mysql"
        );
    }

    private String findExecutableExact(String... candidates) {
        for (String cmd : candidates) {
            try {
                if (cmd.contains(File.separator)) {
                    if (Files.exists(Paths.get(cmd))) {
                        return cmd;
                    }
                } else {
                    new ProcessBuilder(cmd, "--version").start();
                    return cmd;
                }
            } catch (Exception ignored) {}
        }
        throw new RuntimeException("❌ Không tìm thấy MySQL client: " + Arrays.toString(candidates));
    }

    /* ===================== BACKUP ===================== */

    public BackupInfo backupDatabase() {
        File folder = new File(getBackupDirectory());
        if (!folder.exists()) folder.mkdirs();

        String timestamp = new java.text.SimpleDateFormat("yyyyMMdd_HHmmss")
                .format(new Date());

        String backupFile = folder + File.separator + "backup_" + timestamp + ".sql";
        String dbName = extractDbName();
        String mysqldump = findMysqlDump();

        List<String> command = List.of(
                mysqldump,
                "--user=" + dbUser,
                "--password=" + dbPassword,
                "--databases",
                "--add-drop-database",
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
                file.getAbsolutePath(),
                file.getName(),
                file.length(),
                new Date().toString()
        );
    }

    public List<BackupInfo> listBackups() {
        File folder = new File(getBackupDirectory());
        if (!folder.exists()) return List.of();

        File[] files = folder.listFiles(f ->
                f.getName().startsWith("backup_") && f.getName().endsWith(".sql"));

        if (files == null) return List.of();

        return Arrays.stream(files)
                .map(file -> {
                    try {
                        BasicFileAttributes attrs =
                                Files.readAttributes(file.toPath(), BasicFileAttributes.class);
                        return new BackupInfo(
                                file.getAbsolutePath(),
                                file.getName(),
                                file.length(),
                                attrs.creationTime().toString()
                        );
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(BackupInfo::createdAt).reversed())
                .collect(Collectors.toList());
    }

    public boolean deleteBackup(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (!path.getFileName().toString().startsWith("backup_")) {
                throw new RuntimeException("Chỉ được xóa file backup");
            }
            return Files.deleteIfExists(path);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa backup: " + e.getMessage(), e);
        }
    }

    /* ===================== RESTORE ===================== */

    public String restoreDatabase(String backupFilePath) {
        Path filePath = Paths.get(backupFilePath);
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File backup không tồn tại");
        }

        try {
            log.info("🔄 Restore từ file {}", backupFilePath);

            String mysql = findMysql();

            List<String> command = new ArrayList<>();
            command.add(mysql);
            command.add("--user=" + dbUser);
            command.add("--password=" + dbPassword);
            command.add("--default-character-set=utf8mb4");

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectInput(new File(backupFilePath));
            pb.redirectErrorStream(true);

            Process process = pb.start();

            StringBuilder output = new StringBuilder();
            try (var reader = new java.io.BufferedReader(
                    new java.io.InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("MySQL: {}", line);
                    output.append(line).append('\n');
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Restore thất bại (exit " + exitCode + "):\n" + output);
            }

            log.info("✅ Restore thành công");
            return backupFilePath;

        } catch (Exception e) {
            log.error("❌ Restore lỗi", e);
            throw new RuntimeException("Restore lỗi: " + e.getMessage(), e);
        }
    }

    /* ===================== EXEC ===================== */

    private void executeCommand(List<String> command, String action, String filePath) {
        try {
            Process process = new ProcessBuilder(command)
                    .redirectErrorStream(true)
                    .start();

            String output = new String(process.getInputStream().readAllBytes());
            int exit = process.waitFor();

            if (exit != 0) {
                throw new RuntimeException(action + " thất bại:\n" + output);
            }

            log.info("✅ {} thành công → {}", action, filePath);

        } catch (Exception e) {
            throw new RuntimeException(action + " lỗi: " + e.getMessage(), e);
        }
    }

    /* ===================== DTO ===================== */

    public record BackupInfo(
            String absolutePath,
            String fileName,
            long fileSize,
            String createdAt
    ) {}
}
