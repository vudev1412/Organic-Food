package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCartItemDTO {
    private Long productId;
    private int quantity;
}