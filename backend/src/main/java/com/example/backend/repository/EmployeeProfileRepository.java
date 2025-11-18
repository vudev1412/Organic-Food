package com.example.backend.repository;

import com.example.backend.domain.EmployeeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, Long>, JpaSpecificationExecutor<EmployeeProfile> {
    EmployeeProfile findByUserId(Long id);
}
