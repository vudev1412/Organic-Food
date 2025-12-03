package com.example.backend.domain;

import com.example.backend.enums.StatusInvoice;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "invoices")
@Getter
@Setter
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private Instant createAt = Instant.now();

    private double deliverFee = 0;

    private double discountAmount = 0;

    private double subtotal = 0;

    // --- TRƯỜNG THUẾ ---
    /** Tỷ lệ thuế áp dụng cho hóa đơn (ví dụ: 0.08 cho 8%) */
    private double taxRate = 0.08;

    /** Số tiền thuế GTGT đã tính (subtotal * taxRate) */
    private double taxAmount = 0;
    // ------------------------

    // --- TRƯỜNG TỔNG CỘNG CUỐI CÙNG ---
    /** Tổng số tiền cuối cùng khách hàng phải trả (Subtotal + TaxAmount + DeliverFee - DiscountAmount) */
    private double total = 0;
    // -----------------------------------

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusInvoice status = StatusInvoice.UNPAID;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", unique = true)
    private Order order;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_user_id", nullable = true)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_user_id", nullable = true)
    private User employee;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;


}