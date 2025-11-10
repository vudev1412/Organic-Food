package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResProductCertificate {
    private Long productId;
    private Long certificateId;
    private String imageUrl;
    private String certNo;
    private Instant date;
}
