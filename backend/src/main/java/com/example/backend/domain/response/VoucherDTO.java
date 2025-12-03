package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherDTO {
    private Long id;
    private String code;
    private double discount;
}
