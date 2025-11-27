package com.example.backend.domain.response;

import com.example.backend.enums.TypePromotion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResProductByPromotionDTO {
    private long productId;
    private String productName;
    private int quantity;
    private String slug;
    private String image;
    private double originalPrice;    // Giá gốc
    private double discountedPrice;  // Giá sau giảm
    private Instant promotionStartDate; // Lấy từ PromotionDetail
    private Instant promotionEndDate;   // Lấy từ PromotionDetail

    private TypePromotion  promotionType; // Ví dụ: PERCENT hoặc FIXED_AMOUNT
    private double promotionValue;       // Ví dụ: 15.0 hoặc 20000.0
}