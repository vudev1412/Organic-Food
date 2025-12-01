package com.example.backend.domain.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TopProductDTO {
    private Long productId;
    private String productName;
    private Long totalSold;
}
