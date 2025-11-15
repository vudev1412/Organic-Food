package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUserDTO {
    private String name;
    private String email;
    private String phone;
}
