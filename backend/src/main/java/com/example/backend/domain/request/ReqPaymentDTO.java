package com.example.backend.domain.request;

import com.example.backend.enums.StatusPayment;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqPaymentDTO {
    private String method;
    private String provider;
    private StatusPayment status;
    private double amount;
    private Instant createAt;
}
