package com.example.backend.domain.response;

import com.example.backend.enums.StatusOrder;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
public class ResOrdersDTO {
    private Long id;
    private Instant orderAt;
    private String note;
    private StatusOrder statusOrder;
    private String shipAddress;
    private Instant estimatedDate;
    private Instant actualDate;
    private Long userId;
}
