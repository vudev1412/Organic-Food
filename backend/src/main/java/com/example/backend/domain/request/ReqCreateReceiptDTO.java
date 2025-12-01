package com.example.backend.domain.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReqCreateReceiptDTO {
    private String deliverName;
    private Instant shipDate;
    private double discount;
    private long supplierId;
    private long userId; // nhân viên tạo
    private List<ReceiptDetailRequest> details;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReceiptDetailRequest {
        private long productId;
        private int quantity;
        private double importPrice;
    }
}