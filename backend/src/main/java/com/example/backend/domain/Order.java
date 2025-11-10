package com.example.backend.domain;

import com.example.backend.enums.StatusOrder;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private Instant orderAt;

    private String note;

    @Enumerated(EnumType.STRING)
    private StatusOrder statusOrder = StatusOrder.PENDING;

    @Column(nullable = false)
    private String shipAddress;

    private Instant estimatedDate;

    private Instant actualDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_user_id")
    private User user;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderDetail> orderDetails;

    @OneToOne(mappedBy = "order",cascade = CascadeType.ALL)
    @JsonIgnore
    private Invoice invoice;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Return> returns;
}
