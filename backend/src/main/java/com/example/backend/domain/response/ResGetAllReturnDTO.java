package com.example.backend.domain.response;

import com.example.backend.enums.StatusReturn;
import com.example.backend.enums.TypeReturn;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Setter
@Getter
@Builder
public class ResGetAllReturnDTO {
    private Long id;
    private String reason;
    private StatusReturn status;
    private TypeReturn returnType;

    private Instant createdAt;
    private Instant approvedAt;

    private int processedBy;
    private String processNote;

    private Long orderId;

    private List<ResReturnItemDTO> returnItems;
    private List<ResReturnImageDTO> returnImages;
}
