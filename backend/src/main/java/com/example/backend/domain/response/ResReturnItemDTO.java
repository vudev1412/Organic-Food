package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResReturnItemDTO {
    private long id;
    private int quantity;
    private double amountRefund;
    private String note;
    private Instant createdAt;
    private long productId;
    private long returnId;
}
