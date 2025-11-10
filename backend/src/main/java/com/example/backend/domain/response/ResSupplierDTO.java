package com.example.backend.domain.response;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResSupplierDTO {
    private Long id;
    private String name;
    private String code;
    private String taxNo;
    private String phone;
    private String email;
    private String address;
}
