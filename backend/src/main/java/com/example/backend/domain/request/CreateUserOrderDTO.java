package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CreateUserOrderDTO {

    // 1. Thông tin người nhận hàng
    private String receiverName;
    private String receiverPhone;
    private String shipAddress; // Địa chỉ giao hàng chi tiết
    private String note;        // Ghi chú đơn hàng (nếu có)
    // 2. Thông tin thanh toán
    private String paymentMethod; // Giá trị: "COD" hoặc "BANK_TRANSFER" (hoặc "BANK")
    private Long voucherId;
    private double subtotal;        // Tổng tiền hàng (chưa cộng thuế/ship, chưa trừ voucher)
    private double shippingFee;
    private double taxAmount;
    private double discountAmount;
    private double totalPrice;      // Tổng cuối cùng phải trả

    // 3. Danh sách sản phẩm trong giỏ hàng
    private List<CartItemDTO> cartItems;

    // Inner class để định nghĩa cấu trúc của từng món hàng
    @Getter
    @Setter
    public static class CartItemDTO {
        private Long productId;
        private int quantity;
        private double price; // Giá bán tại thời điểm đặt hàng
    }
}