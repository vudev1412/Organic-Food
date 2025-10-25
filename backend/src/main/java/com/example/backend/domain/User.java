package com.example.backend.domain;


import com.example.backend.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Type;
import java.time.Instant;

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

    private String phone;

    @NotBlank(message = "Password không được để trống")
    private String password;

    private String address;

    private Instant createAt;

    private Instant updateAt;

    @Enumerated(EnumType.STRING)
    private Role userRole;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;

}
