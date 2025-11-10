package com.example.backend.repository;

import com.example.backend.domain.ReturnImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnImageRepository extends JpaRepository<ReturnImage, Long> {
}
