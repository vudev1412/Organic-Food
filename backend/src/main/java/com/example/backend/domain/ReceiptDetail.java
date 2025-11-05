package com.example.backend.domain;

import com.example.backend.domain.key.ReceiptDetailKey;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "receiptDetails")
@Getter
@Setter
public class ReceiptDetail {
    @EmbeddedId
    private ReceiptDetailKey id;

    private int quantity;

    private double importPrice;

    @ManyToOne
    @MapsId("receiptId")
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;
}
