package com.example.backend.domain.request;

import com.example.backend.domain.Certificate;
import com.example.backend.domain.Product;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqUpdateProductCertificate {
    private String imageUrl;
    private String certNo;
    private Instant date;

    private Product product;
    private Certificate certificate;
}
