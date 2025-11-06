package com.example.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String code;

    private String taxNo;

    private String phone;

    private String email;

    private String address;

    @OneToMany(mappedBy = "supplier",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Receipt> receipts;
}
