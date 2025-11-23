package com.example.backend.domain.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Long id;
    private String productName;
    private String slug;
    private String image;

    private BigDecimal originalPrice;
    private BigDecimal price; // Giá sau khuyến mãi

    private Integer quantity;
    private Integer stock;
    // Thông tin khuyến mãi
    private Long promotionId;
    private String promotionType; // Có thể để String hoặc Enum
    private Double value;
}