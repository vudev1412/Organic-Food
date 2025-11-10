package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResReturnImageDTO {
    private long id;
    private String imageUrl;
    private Instant uploadedAt;
    private long returnId;
}
