package com.example.backend.domain;


import com.example.backend.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Type;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "users")
@Setter
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @NotBlank(message = "Email không được để trống")
    private String email;

    @Column(unique = true)
    private String phone;

    @NotBlank(message = "Password không được để trống")
    private String password;

    private String address;

    private String image;

    private Instant createAt;

    private Instant updateAt;

    @Enumerated(EnumType.STRING)
    private Role userRole;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private CustomerProfile customerProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private EmployeeProfile employeeProfile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CustomerAddress> customerAddresses;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Cart cart;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Order> orders;

    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Invoice> invoiceCustomerList;

    @OneToMany(mappedBy = "employee",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Invoice> invoiceEmployeeList;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Receipt> receipts;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Review> reviews;
}
