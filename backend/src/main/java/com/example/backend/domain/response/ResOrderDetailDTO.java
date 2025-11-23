package com.example.backend.domain.response;

import com.example.backend.domain.Unit;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
public class ResOrderDetailDTO {
    private Long orderId;
    private Long productId;
    private int quantity;
    private double price;

    // Thông tin Order
    private OrderInfo order;

    // Thông tin Product
    private ProductInfo product;

    @Getter
    @Setter
    public static class OrderInfo {
        private Long id;
        private Instant orderAt;
        private String statusOrder;
        private String shipAddress;
        private String customerName; // Từ user
    }

    @Getter
    @Setter
    public static class ProductInfo {
        private Long id;
        private String name;
        private Unit unit;
        private String image;
        private String slug;
    }
}