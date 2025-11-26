package com.example.backend.repository;

import com.example.backend.domain.Product;
import com.example.backend.domain.ReceiptDetail;
import com.example.backend.domain.key.ReceiptDetailKey;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptDetailRepository extends JpaRepository<ReceiptDetail, ReceiptDetailKey> {
    @Query("""
        SELECT rd.product
        FROM ReceiptDetail rd
        JOIN rd.receipt r
        WHERE rd.product.active = true
        ORDER BY r.createdAt DESC
    """)
    List<Product> findNewestImportedProducts(Pageable pageable);
    @Query("""
    SELECT rd.product,
           promo,
           CASE 
               WHEN promo.type = com.example.backend.enums.TypePromotion.PERCENT
                    THEN (rd.product.price * promo.value / 100)
               WHEN promo.type = com.example.backend.enums.TypePromotion.FIXED_AMOUNT
                    THEN promo.value
               ELSE 0
           END AS discountValue,
           pd.startDate, pd.endDate
    FROM ReceiptDetail rd
    LEFT JOIN rd.product p
    LEFT JOIN p.promotionDetails pd
    LEFT JOIN pd.promotion promo
        ON promo.active = true
        AND pd.startDate <= CURRENT_TIMESTAMP
        AND pd.endDate >= CURRENT_TIMESTAMP
    ORDER BY rd.receipt.createdAt DESC, discountValue DESC
""")
    List<Object[]> findNewestProductsWithPromotion(Pageable pageable);

}
