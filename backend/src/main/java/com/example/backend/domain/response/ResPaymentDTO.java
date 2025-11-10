package com.example.backend.domain.response;

import com.example.backend.enums.StatusPayment;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResPaymentDTO {
    private Long id;
    private String method;
    private String provider;
    private StatusPayment status;
    private double amount;
    private Instant createAt;
}
