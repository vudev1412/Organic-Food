package com.example.backend.service.impl;

import com.example.backend.domain.Permission;
import com.example.backend.domain.Role;
import com.example.backend.repository.PermissionRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    @Override
    public List<Role> getAllRole() {
        return this.roleRepository.findAll();
    }
    @Override
    public void deleteRole(String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));
        roleRepository.delete(role);
    }
    @Override
    public Role createRole(String roleName) {
        if (roleRepository.findByName(roleName).isPresent()) {
            throw new RuntimeException("Role đã tồn tại");
        }
        Role role = new Role();
        role.setName(roleName);
        return roleRepository.save(role);
    }
    @Override
    public void updatePermissionsForRole(String roleName, Set<String> permissionNames) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        // Lấy tất cả permission theo tên
        Set<Permission> newPermissions = permissionNames.stream()
                .map(name -> permissionRepository.findByName(name)
                        .orElseThrow(() -> new RuntimeException("Permission không tồn tại: " + name))
                )
                .collect(Collectors.toSet());

        // Gán mới
        role.setPermissions(newPermissions);
        roleRepository.save(role);
    }
}
