package com.example.backend.domain.request;

import com.example.backend.enums.TypePromotion;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqPromotionDTO {
    private String name;
    private TypePromotion type;
    private double value;
    private boolean active = true;
}
