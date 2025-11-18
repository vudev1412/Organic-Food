package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ProductCertificateDTO {
    private String imageUrl;
    private String certNo;
    private Instant date;

    private ResProductDTO product;
    private ResCertificateDTO certificate;
}
