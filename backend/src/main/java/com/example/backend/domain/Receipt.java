package com.example.backend.domain;

import com.example.backend.enums.StatusReceipt;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "receipts")
@Getter
@Setter
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private Instant shipDate;

    private String deliverName;

    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    private double discount;

    private double totalAmount;

    @Enumerated(EnumType.STRING)
    private StatusReceipt status;

    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_user_id")
    private User user;

    @OneToMany(mappedBy = "receipt",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReceiptDetail> receiptDetails;
}
