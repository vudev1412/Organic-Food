package com.example.backend.domain.response;

import com.example.backend.enums.TypeVoucher;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResVoucherDTO {
    private Long id;
    private String code;
    private String description;
    private TypeVoucher typeVoucher;
    private double value;
    private double maxDiscountAmount;
    private double minOrderValue;
    private Instant startDate;
    private Instant endDate;
    private int quantity;
    private int usedCount;
    private boolean active;
}
