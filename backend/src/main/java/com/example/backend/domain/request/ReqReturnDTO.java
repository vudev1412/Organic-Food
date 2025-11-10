package com.example.backend.domain.request;

import com.example.backend.enums.StatusReturn;
import com.example.backend.enums.TypeReturn;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqReturnDTO {
    private String reason;
    private StatusReturn status;
    private TypeReturn returnType;
    private Instant createdAt;
    private Instant approvedAt;
    private int processedBy;
    private String processNote;
    private long orderId;
}
