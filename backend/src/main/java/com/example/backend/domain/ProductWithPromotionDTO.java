package com.example.backend.domain;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ProductWithPromotionDTO {
    private Long id;
    private String name;
    private double price;
    private String slug;
    private String image;
    private int quantity;
    // Promotion info
    private String promotionType;
    private double promotionValue;
    private Instant startDate;
    private Instant endDate;
}