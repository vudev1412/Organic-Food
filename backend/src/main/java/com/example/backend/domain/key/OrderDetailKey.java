package com.example.backend.domain.key;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class OrderDetailKey implements Serializable {
    private Long orderId;
    private Long productId;
}
