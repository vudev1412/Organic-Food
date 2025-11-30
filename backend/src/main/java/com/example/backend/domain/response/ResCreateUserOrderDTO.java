package com.example.backend.domain.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResCreateUserOrderDTO {
    // ID đơn hàng (Quan trọng nhất để gọi API thanh toán)
    private Long id;

    // Tổng tiền (Để frontend hiển thị hoặc gửi sang payment gateway)
    private double totalPrice;

    // Phương thức thanh toán (COD / BANK_TRANSFER)
    // Frontend dùng cái này để quyết định chuyển hướng trang hay hiện QR
    private String paymentMethod;

    // Thông tin cơ bản để hiển thị xác nhận nhanh
    private String receiverName;
    private String receiverPhone;
    private String address;

    // Trạng thái thanh toán hiện tại
    private String paymentStatus;
}