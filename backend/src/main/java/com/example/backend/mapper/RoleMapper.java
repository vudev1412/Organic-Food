package com.example.backend.mapper;

import com.example.backend.domain.Role;
import com.example.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleMapper {
    private final RoleRepository roleRepository;
    public Role map(String roleName) {
        if (roleName == null) return null;
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));
    }
}
