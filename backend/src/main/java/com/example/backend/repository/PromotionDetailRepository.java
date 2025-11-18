package com.example.backend.repository;

import com.example.backend.domain.PromotionDetail;
import com.example.backend.domain.key.PromotionDetailKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionDetailRepository extends JpaRepository<PromotionDetail, PromotionDetailKey> {
    List<PromotionDetail> findByProduct_Id(Long productId);
    List<PromotionDetail> findByPromotion_Id(Long promotionId);
}
