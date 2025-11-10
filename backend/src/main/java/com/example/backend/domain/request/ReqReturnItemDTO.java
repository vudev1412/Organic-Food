package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqReturnItemDTO {
    private int quantity;
    private double amountRefund;
    private String note;
    private Instant createdAt;
    private long productId;
    private long returnId;
}
