package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResNewArrivalWithPromotionDTO {

    // Thông tin sản phẩm
    private Long id;
    private String name;
    private String unit;
    private double originalPrice;
    private double finalPrice;
    private String origin_address;
    private String description;
    private double rating_avg;
    private int quantity;
    private String slug;
    private String image;
    private boolean active;
    private Long categoryId;

    // Khuyến mãi tốt nhất (nếu có)
    private Long promotionId;
    private String promotionName;
    private String promotionType; // PERCENT / FIXED_AMOUNT
    private double promotionValue; // giá trị giảm
    private Instant promotionStartDate;
    private Instant promotionEndDate;
}
