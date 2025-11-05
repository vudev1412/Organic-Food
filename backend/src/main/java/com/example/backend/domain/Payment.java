package com.example.backend.domain;

import com.example.backend.enums.StatusPayment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String method;

    private String provider;

    @Enumerated(EnumType.STRING)
    private StatusPayment status;

    private double amount;

    private Instant createAt;

    @OneToMany(mappedBy = "payment",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Invoice> invoices;
}
