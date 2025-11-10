package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResOrderDetailDTO {
    private Long orderId;
    private Long productId;
    private int quantity;
    private double price;
}
