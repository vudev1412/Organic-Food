package com.example.backend.controller;

import com.example.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping("/{roleName}/permissions/{permissionName}")
    public ResponseEntity<String> addPermission(@PathVariable String roleName,
                                                @PathVariable String permissionName) {
        roleService.addPermissionToRole(roleName, permissionName);
        return ResponseEntity.ok("Added permission " + permissionName + " to role " + roleName);
    }
}
