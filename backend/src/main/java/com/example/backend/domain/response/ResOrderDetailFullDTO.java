package com.example.backend.domain.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResOrderDetailFullDTO {
    private Long orderId;
    private Long productId;
    private int quantity;
    private double price;

    private ResProductDTO product;
    private ResOrderDTO order;
}
