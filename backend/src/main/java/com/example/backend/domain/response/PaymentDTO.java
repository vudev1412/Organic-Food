package com.example.backend.domain.response;


import com.example.backend.enums.StatusPayment;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class PaymentDTO {
    private long id;
    private String method;
    private String provider;
    private StatusPayment status;
    private double amount;
    private Instant createAt;
    private List<InvoiceDTO> invoices;
}
