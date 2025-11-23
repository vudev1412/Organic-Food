package com.example.backend.repository;

import com.example.backend.domain.PromotionDetail;
import com.example.backend.domain.key.PromotionDetailKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface PromotionDetailRepository extends JpaRepository<PromotionDetail, PromotionDetailKey> {
    List<PromotionDetail> findByProduct_Id(Long productId);
    List<PromotionDetail> findByPromotion_Id(Long promotionId);
    @Query("SELECT pd FROM PromotionDetail pd " +
            "JOIN FETCH pd.promotion p " + // JOIN và tải luôn Promotion
            "JOIN FETCH pd.product pr " +  // JOIN và tải luôn Product
            "WHERE pr.id = :productId " +
            "AND p.active = true " +           // Lấy 'active' từ Promotion
            "AND pd.startDate <= :currentDate " + // Lấy 'startDate' từ PromotionDetail
            "AND pd.endDate >= :currentDate")     // Lấy 'endDate' từ PromotionDetail
    List<PromotionDetail> findAllActivePromotionsForProduct(
            @Param("productId") Long productId,
            @Param("currentDate") Instant currentDate
    );
}
