package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqPromotionDetailDTO {
    private long promotionId;
    private long productId;
    private Instant startDate;
    private Instant endDate;
}
