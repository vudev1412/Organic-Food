package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResCartItemDTO {
    private Long id;

    private int quantity;

    private Instant addedAt;

    private Long cartId;

    private Long productId;
}
