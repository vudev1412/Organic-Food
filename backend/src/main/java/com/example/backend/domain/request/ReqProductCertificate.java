package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqProductCertificate {
    private Long productId;
    private Long certificateId;
    private String imageUrl;

    private String certNo;

    private Instant date;
}
