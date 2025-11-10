package com.example.backend.domain.key;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductCertificateKey implements Serializable {
    private Long productId;
    private Long certificateId;
}
