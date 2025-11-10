package com.example.backend.domain.response;

import com.example.backend.enums.StatusInvoice;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResInvoiceDTO {
    private Long id;
    private Instant createAt;
    private double deliverFee;
    private double discountAmount;
    private double subtotal;
    private StatusInvoice status;
    private Long orderId;
    private Long customerId;
    private Long employeeId;
    private Long paymentId;
    private Long voucherId;
}
