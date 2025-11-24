package com.example.backend.domain.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
public class ResCertificateProductDTO {
    private Long id;
    private String name;
    private String image;
    private String certNo;
    private String imageUrl;
    private Instant date;
}

