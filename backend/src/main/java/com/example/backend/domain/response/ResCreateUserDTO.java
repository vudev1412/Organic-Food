package com.example.backend.domain.response;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCreateUserDTO {
    private String name;

    private String email;

    private String phone;
}
