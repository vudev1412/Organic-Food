package com.example.backend.domain.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResSupplierDTO {
    private Long id;
    private String name;
    private String code;
    private String taxNo;
    private String phone;
    private String email;
    private String address;
}
