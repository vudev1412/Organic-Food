package com.example.backend.domain.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
public class ResPromotionDetailDTO {
    private ResPromotionProductDTO product;
    private Instant startDate;
    private Instant endDate;
}
