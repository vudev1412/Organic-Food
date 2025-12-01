package com.example.backend.controller;

import com.example.backend.domain.Role;
import com.example.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

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

    @GetMapping
    public ResponseEntity<List<Role>> handleGetAllRole(){
        return ResponseEntity.ok().body(this.roleService.getAllRole());
    }
    @DeleteMapping("/{roleName}")
    public ResponseEntity<String> deleteRole(@PathVariable String roleName) {
        roleService.deleteRole(roleName);
        return ResponseEntity.ok("Deleted role " + roleName);
    }
    @PostMapping("/{roleName}")
    public ResponseEntity<Role> createRole(@PathVariable String roleName) {
        Role role = roleService.createRole(roleName);
        return ResponseEntity.ok(role);
    }
    @PutMapping("/{roleName}/permissions")
    public ResponseEntity<String> updatePermissions(
            @PathVariable String roleName,
            @RequestBody Set<String> permissionNames) {
        roleService.updatePermissionsForRole(roleName, permissionNames);
        return ResponseEntity.ok("Updated permissions for role " + roleName);
    }


}
