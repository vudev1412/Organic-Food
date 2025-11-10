package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResPromotionDetailDTO {
    private long promotionId;
    private long productId;
    private Instant startDate;
    private Instant endDate;
}
