package com.example.backend.domain;

import com.example.backend.enums.TypeVoucher;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true,nullable = false)
    private String code;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeVoucher typeVoucher;

    @Column(nullable = false)
    private double value;

    private double maxDiscountAmount;

    private double minOrderValue;

    private Instant startDate;

    private Instant endDate;

    private int quantity;

    private int usedCount;

    private boolean isActive;

    @OneToMany(mappedBy = "voucher",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Invoice> invoices;


}
