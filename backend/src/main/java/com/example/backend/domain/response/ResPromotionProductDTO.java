package com.example.backend.domain.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResPromotionProductDTO {
    private Long id;
    private String name;
    private double price;
    private String image;
    private String slug;
}

