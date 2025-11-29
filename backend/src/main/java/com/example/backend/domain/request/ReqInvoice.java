package com.example.backend.domain.request;

import com.example.backend.enums.StatusInvoice;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqInvoice {

    private double deliverFee;
    private double discountAmount;
    private double subtotal;
    private double taxRate;
    private double taxAmount;
    private double total;
    private StatusInvoice status;

    private Long orderId;
    private Long customerId;
    private Long employeeId;
    private Long paymentId;
    private Long voucherId;
}
