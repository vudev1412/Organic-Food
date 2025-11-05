package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "return_items")
@Getter
@Setter
public class ReturnItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

     private int quantity;

     private double amountRefund;

     private String note;

     private Instant createdAt;

     @OneToOne
     @JoinColumn(name = "product_id")
     private Product product;

     @ManyToOne
     @JoinColumn(name = "return_id")
     private Return returns;
}
