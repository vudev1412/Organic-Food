package com.example.backend.domain.response;

import com.example.backend.enums.TypePromotion;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ResPromotionDTO {
    private Long id;
    private String name;
    private TypePromotion type;
    private double value;
    private boolean active;
    private List<ResPromotionDetailDTO> promotionDetails;
}
