package com.example.backend.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "employee_profile")
@Getter
@Setter
public class EmployeeProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String employeeCode;

    private String address;

    private Instant hireDate;

    private double salary;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
