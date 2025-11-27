package com.example.backend.domain.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResOrderDetalDTO {
    private Long id; // orderDetailId
    private int quantity;
    private double price;

    private Long productId;
    private String productName;
    private String productImage;
    private Double productPrice;
}
