package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCustomerAddress {
    private String receiverName;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String street;
    private String note;
    private boolean defaultAddress;
}
