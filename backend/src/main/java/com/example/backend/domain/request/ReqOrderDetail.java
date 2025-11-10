package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqOrderDetail {
    private Long orderId;
    private Long productId;
    private int quantity;
    private double price;
}
