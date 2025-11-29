package com.example.backend.domain.request;

import lombok.Data;

@Data
public class CreatePaymentDTO {
    private  Long orderId;
    private Long amount;        // Số tiền
    private String description; // Nội dung thanh toán
    private String buyerName;   // Tên người mua (Optional)
    private String buyerPhone;  // SĐT người mua (Optional)
}