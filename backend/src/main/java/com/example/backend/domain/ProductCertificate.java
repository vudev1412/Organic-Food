package com.example.backend.domain;

import com.example.backend.domain.key.ProductCertificateKey;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "product_certificates")
@Getter
@Setter
public class ProductCertificate {
    @EmbeddedId
    private ProductCertificateKey id;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @MapsId("certificateId")
    @JoinColumn(name = "certificate_id")
    private Certificate certificate;

    private String imageUrl;

    private String certNo;

    private Instant date;

}
