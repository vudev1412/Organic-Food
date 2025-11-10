package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCustomerProfile {
    private Long id;
    private boolean member;
    private Long userId;
}
