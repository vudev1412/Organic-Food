package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCustomerProfile {
    private boolean member;
    private Long userId;
}
