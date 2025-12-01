package com.example.backend.service;

import com.example.backend.domain.Permission;

import java.util.List;

public interface PermissionService {
    List<Permission> getAllPermissions();
}
