package com.example.backend.domain.request;

import com.example.backend.enums.TypePromotion;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReqCreatePromotionDTO {
    private String name;
    private TypePromotion type;
    private double value;
    private boolean active;

    private List<PromotionProductDTO> products;
}
