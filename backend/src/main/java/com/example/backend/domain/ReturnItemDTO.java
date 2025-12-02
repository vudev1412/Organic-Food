package com.example.backend.domain;

import lombok.Data;

@Data
public class ReturnItemDTO {
    private Long productId;
    private int quantity;
    private String note;
}