package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqReturnImageDTO {
    private String imageUrl;
    private Instant uploadedAt;
    private long returnId;
}
