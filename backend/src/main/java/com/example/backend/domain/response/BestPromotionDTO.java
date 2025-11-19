package com.example.backend.domain.response;

import com.example.backend.enums.TypePromotion;

import java.time.Instant;


// Sử dụng record (Java 16+) cho DTO gọn gàng, hoặc tạo class Java bình thường
public record BestPromotionDTO(
        long id,
        String promotionName,
        TypePromotion type, // Giữ nguyên kiểu Enum
        double value,
        double originalPrice,
        double discountAmount, // Số tiền thực tế được giảm
        double finalPrice, // Giá sau khi giảm
        Instant endDate // Ngày hết hạn
) {
}