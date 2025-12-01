package com.example.backend.domain.response;

import com.example.backend.domain.request.ReqProductDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptDetailDTO {
    private int quantity;
    private double importPrice;
    private ProductDTO product;
}
