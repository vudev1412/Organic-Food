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
public class PromotionDetailKey implements Serializable {
    private Long promotionId;
    private Long productId;
}
