package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResReceiptDetailDTO {
    private long receiptId;
    private long productId;
    private int quantity;
    private double importPrice;
}
