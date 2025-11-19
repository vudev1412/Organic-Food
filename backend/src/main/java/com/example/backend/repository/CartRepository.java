package com.example.backend.repository;

import com.example.backend.domain.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query(value = """
        SELECT 
            id, product_name, slug, image, originalPrice, 
            final_price AS price, quantity, 
            promotion_id, promotion_type, promotion_value AS value
        FROM (
            SELECT 
                p.id, p.name AS product_name, p.slug, p.image, p.price AS originalPrice,
                ci.quantity,
                promo.id AS promotion_id, promo.type AS promotion_type, promo.value AS promotion_value,
                
                CAST(CASE 
                    WHEN UPPER(promo.type) = 'PERCENT' THEN p.price * (1 - promo.value / 100)
                    WHEN UPPER(promo.type) = 'FIXED_AMOUNT' THEN GREATEST(p.price - promo.value, 0)
                    ELSE p.price 
                END AS DECIMAL(10,2)) AS final_price,
        
                ROW_NUMBER() OVER (
                    PARTITION BY ci.product_id 
                    ORDER BY 
                        (CASE 
                            WHEN UPPER(promo.type) = 'PERCENT' THEN p.price * (1 - promo.value / 100)
                            WHEN UPPER(promo.type) = 'FIXED_AMOUNT' THEN GREATEST(p.price - promo.value, 0)
                            ELSE p.price 
                        END) ASC, promo.id DESC 
                ) as rn
            FROM carts c
            JOIN cartItems ci ON c.id = ci.cart_id
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN promotion_detail pd ON p.id = pd.product_id AND NOW() BETWEEN pd.start_date AND pd.end_date
            LEFT JOIN promotions promo ON pd.promotion_id = promo.id AND promo.active = TRUE
            WHERE c.user_id = :userId
        ) AS temp_table
        WHERE temp_table.rn = 1
        """, nativeQuery = true)
    List<Object[]> fetchCartItemsRaw(@Param("userId") Long userId);
}
