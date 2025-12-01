package com.example.backend.service;

import com.example.backend.domain.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {
    void addPermissionToRole(String roleName, String permissionName);
    void removePermissionFromRole(String roleName, String permissionName);
    List<Role> getAllRole();
    void deleteRole(String roleName);
    Role createRole(String roleName);
    void updatePermissionsForRole(String roleName, Set<String> permissionNames);
}
