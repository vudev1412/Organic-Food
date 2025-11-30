package com.example.backend.service.impl;

import com.example.backend.domain.Permission;
import com.example.backend.domain.Role;
import com.example.backend.repository.PermissionRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    @Override
    public void addPermissionToRole(String roleName, String permissionName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        Permission permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission không tồn tại"));

        role.getPermissions().add(permission);
        roleRepository.save(role);
    }

    @Override
    public void removePermissionFromRole(String roleName, String permissionName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        Permission permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission không tồn tại"));

        role.getPermissions().remove(permission);
        roleRepository.save(role);
    }
}
