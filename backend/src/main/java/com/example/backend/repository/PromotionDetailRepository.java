package com.example.backend.repository;

import com.example.backend.domain.PromotionDetail;
import com.example.backend.domain.key.PromotionDetailKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionDetailRepository extends JpaRepository<PromotionDetail, PromotionDetailKey> {
}
