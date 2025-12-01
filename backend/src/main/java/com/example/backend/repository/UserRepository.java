package com.example.backend.repository;

import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    User findByEmail(String email);
    User findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    User findByRefreshTokenAndEmail(String token, String email);
    @Query("""
    SELECT COUNT(u)
    FROM User u
    WHERE u.createAt BETWEEN :start AND :end
""")
    Long countNewCustomersBetween(
            @Param("start") Instant start,
            @Param("end") Instant end
    );




}
