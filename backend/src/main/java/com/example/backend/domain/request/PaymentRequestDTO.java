package com.example.backend.domain.request;

import lombok.Data;
import java.util.List;

@Data
public class PaymentRequestDTO {
    private Long orderId;           // ID đơn hàng (nếu đã tạo)
    private Long userId;            // ID người dùng
    private Long amount;            // Tổng tiền (VND)
    private String orderInfo;       // Mô tả đơn hàng
    private List<CartItem> items;   // Danh sách sản phẩm
    private String bankCode;        // Mã ngân hàng (optional)

    @Data
    public static class CartItem {
        private Long productId;
        private String productName;
        private Integer quantity;
        private Long price;
    }
}