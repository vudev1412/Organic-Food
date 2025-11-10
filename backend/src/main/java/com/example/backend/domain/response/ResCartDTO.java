package com.example.backend.domain.response;

import com.example.backend.domain.CartItem;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ResCartDTO {
    private Long id;

    private Instant createdAt;

    private Instant updatedAt;

    private Long userId;

    private List<CartItem> items;
}
