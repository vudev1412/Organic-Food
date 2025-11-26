package com.example.backend.domain.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public abstract class PaymentDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VNPayResponse {
        private String code;
        private String message;
        private String paymentUrl;
    }
}
