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
public class ReceiptDetailKey implements Serializable {
    private Long receiptId;
    private Long productId;
}
