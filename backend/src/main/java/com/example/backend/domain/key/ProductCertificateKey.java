package com.example.backend.domain.key;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class ProductCertificateKey implements Serializable {
    private Long productId;
    private Long certificateId;
}
