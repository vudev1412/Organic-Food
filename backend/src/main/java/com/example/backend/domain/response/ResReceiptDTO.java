package com.example.backend.domain.response;

import com.example.backend.enums.StatusReceipt;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResReceiptDTO {
    private Long id;
    private Instant shipDate;
    private String deliverName;
    private double discount;
    private double totalAmount;
    private StatusReceipt status;
    private Instant createdAt;
    private Long supplierId;
    private Long userId;
}
