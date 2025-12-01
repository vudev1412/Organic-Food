package com.example.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PromotionDTO {
    private Long id;
    private String name;
    private String type;
    private double value;
}