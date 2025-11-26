package com.example.backend.repository;

import com.example.backend.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> getProductByCategory_Id(Long categoryId);
    Page<Product> findAllByCategoryIdIn(List<Long> categoryId, Pageable pageable);
    @Query("""
    SELECT DISTINCT p
    FROM Product p
    LEFT JOIN FETCH p.productCertificates pc
    LEFT JOIN FETCH pc.certificate c
    LEFT JOIN FETCH p.productImages pi
    """)
    List<Product> findAllWithCertificates();

    List<Product> findByNameStartingWithIgnoreCase(String name, Pageable pageable);
    List<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    @Query("""
    SELECT p, promo,
           CASE 
               WHEN promo.type = com.example.backend.enums.TypePromotion.PERCENT
                    THEN (p.price * promo.value / 100)
               WHEN promo.type = com.example.backend.enums.TypePromotion.FIXED_AMOUNT
                    THEN promo.value
               ELSE 0
           END AS discountValue,
           pd.startDate, pd.endDate
    FROM PromotionDetail pd
    JOIN pd.product p
    JOIN pd.promotion promo
    WHERE promo.active = true
      AND pd.startDate <= CURRENT_TIMESTAMP
      AND pd.endDate >= CURRENT_TIMESTAMP
    ORDER BY discountValue DESC
""")
    List<Object[]> findProductsWithPromotion(Pageable pageable);



}
