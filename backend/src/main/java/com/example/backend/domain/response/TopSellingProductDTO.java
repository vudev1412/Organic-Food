package com.example.backend.domain.response;


import com.example.backend.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopSellingProductDTO {
    private Long productId;
    private String productName;
    private int quantitySold;
}
