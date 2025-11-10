package com.example.backend.domain.response;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResEmployeeProfile {
    private Long id;

    private String employeeCode;

    private String address;

    private Instant hireDate;

    private double salary;

    private Long userId;
}
