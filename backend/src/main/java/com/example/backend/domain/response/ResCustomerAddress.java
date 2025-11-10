package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCustomerAddress {
    private Long id;
    private String receiverName;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String street;
    private String note;
    private boolean defaultAddress;
    private Long userId;
}
