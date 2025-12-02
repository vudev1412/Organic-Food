package com.example.backend.domain.response;

import lombok.Data;

public @Data
class ReturnItemResponseDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private int quantity;
    private String note;
}