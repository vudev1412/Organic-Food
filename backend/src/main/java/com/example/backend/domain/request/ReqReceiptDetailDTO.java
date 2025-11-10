package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqReceiptDetailDTO {
    private long receiptId;
    private long productId;
    private int quantity;
    private double importPrice;
}
