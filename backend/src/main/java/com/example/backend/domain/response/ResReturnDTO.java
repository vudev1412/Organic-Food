package com.example.backend.domain.response;

import com.example.backend.enums.StatusReturn;
import com.example.backend.enums.TypeReturn;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResReturnDTO {
    private long id;
    private String reason;
    private StatusReturn status;
    private TypeReturn returnType;
    private Instant createdAt;
    private Instant approvedAt;
    private int processedBy;
    private String processNote;

    private long orderId;
    private String customerName;
}
