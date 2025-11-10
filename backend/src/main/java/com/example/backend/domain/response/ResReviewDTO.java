package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResReviewDTO {
    private Long id;
    private String comment;
    private int rating;
    private Instant createdAt;
    private Long productId;
    private Long userId;
}
