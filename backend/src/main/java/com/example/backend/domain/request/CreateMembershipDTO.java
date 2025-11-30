package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMembershipDTO {
    private long userId;
    // Có thể truyền amount từ FE hoặc fix cứng trong code BE cũng được
    private double amount;
}