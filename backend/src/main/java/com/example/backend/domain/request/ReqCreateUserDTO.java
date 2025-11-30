package com.example.backend.domain.request;

import com.example.backend.domain.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCreateUserDTO {
    private String name;
    private String email;
    private String password;
    private String phone;
    private  String roleName;
}
