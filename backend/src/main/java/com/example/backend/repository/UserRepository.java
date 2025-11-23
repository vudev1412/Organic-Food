package com.example.backend.repository;

import com.example.backend.domain.User;
import com.example.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    User findByEmail(String email);
    User findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    User findByRefreshTokenAndEmail(String token, String email);
}
