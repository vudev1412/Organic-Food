package com.example.backend.service;

public interface RoleService {
    void addPermissionToRole(String roleName, String permissionName);
    void removePermissionFromRole(String roleName, String permissionName);
}
