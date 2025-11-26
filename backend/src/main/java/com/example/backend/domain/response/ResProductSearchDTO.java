package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResProductSearchDTO {
    private ResProductDTO product; // Thông tin cơ bản của sản phẩm
    private BestPromotionDTO bestPromotion; // Thông tin khuyến mãi tốt nhất (nếu có)
}