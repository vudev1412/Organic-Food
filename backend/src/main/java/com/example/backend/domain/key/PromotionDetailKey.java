package com.example.backend.domain.key;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class PromotionDetailKey implements Serializable {
    private Long promotionId;
    private Long productId;
}
