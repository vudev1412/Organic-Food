package com.example.backend.domain.response;

import com.example.backend.enums.StatusReceipt;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResReceiptDTO {
    private long id;
    private String deliverName;
    private double discount;
    private double totalAmount;
    private Instant shipDate;
    private SupplierDTO supplier;
    private UserDTO user;
    private List<ReceiptDetailDTO> receiptDetails;
}
