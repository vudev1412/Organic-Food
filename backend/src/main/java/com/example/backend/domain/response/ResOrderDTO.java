package com.example.backend.domain.response;

import com.example.backend.enums.StatusOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResOrderDTO {
    // --- THÔNG TIN CHUNG ĐƠN HÀNG ---
    private Long id;
    private Instant orderAt;
    private String note;
    private StatusOrder statusOrder;
    private Instant estimatedDate;
    private Instant actualDate;

    // --- THÔNG TIN GIAO HÀNG ---
    private String shipAddress;    // Địa chỉ đầy đủ
    private String receiverName;   // Tên người nhận
    private String receiverPhone;  // SĐT người nhận

    // --- THÔNG TIN TÀI CHÍNH (Từ Invoice) ---
    private String paymentMethod;  // COD / BANK_TRANSFER
    private String paymentStatus;  // PENDING / PAID

    private double totalPrice;     // Tổng tiền khách phải trả
    private double subtotal;       // Tổng tiền hàng
    private double shippingFee;    // Phí vận chuyển
    private double taxAmount;      // Thuế
    private double discountAmount; // Giảm giá

    // --- DANH SÁCH CHI TIẾT SẢN PHẨM ---
    // Đây là List các món hàng trong đơn
    private List<ResOrderDetailItem> orderDetails;
    private Long userId;
    // Inner class định nghĩa cấu trúc 1 món hàng trong list này
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResOrderDetailItem {
        private Long productId;
        private String productName;
        private String productImage; // Cần thiết để hiển thị ảnh
        private String productSlug;  // Cần thiết để click vào xem chi tiết
        private int quantity;
        private double price;        // Giá bán tại thời điểm mua
    }
}