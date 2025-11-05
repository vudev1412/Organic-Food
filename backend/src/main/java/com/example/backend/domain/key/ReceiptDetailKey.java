package com.example.backend.domain.key;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class ReceiptDetailKey implements Serializable {
    private Long receiptId;
    private Long productId;
}
