package com.example.backend.domain.response;

import com.example.backend.enums.TypePromotion;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResPromotionDTO {
    private long id;
    private String name;
    private TypePromotion type;
    private double value;
    private boolean active;
}
