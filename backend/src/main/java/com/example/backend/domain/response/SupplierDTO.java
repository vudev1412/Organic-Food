package com.example.backend.domain.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDTO {
    private long id;
    private String name;
    private String code;
    private String taxNo;
    private String phone;
    private String email;
    private String address;

}
