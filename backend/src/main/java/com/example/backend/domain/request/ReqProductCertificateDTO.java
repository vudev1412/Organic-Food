package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqProductCertificateDTO {
    private Long certificateId;
    private String imageUrl;
    private String certNo;
    private Instant date;
}
