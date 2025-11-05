package com.example.backend.domain;

import com.example.backend.domain.key.PromotionDetailKey;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "promotion_detail")
public class PromotionDetail {

    @EmbeddedId
    private PromotionDetailKey id;

    @ManyToOne
    @MapsId("promotionId")
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;


    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    private Instant startDate;

    private Instant endDate;
}
