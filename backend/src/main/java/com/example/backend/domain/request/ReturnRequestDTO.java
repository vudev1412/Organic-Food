package com.example.backend.domain.request;

import com.example.backend.domain.ReturnItemDTO;
import lombok.Data;

import java.util.List;

@Data
public class ReturnRequestDTO {
    private Long orderId;
    private String reason;
    private String returnType; // REFUND or EXCHANGE
    private List<ReturnItemDTO> items;
    private List<String> imageUrls; // FE upload ảnh trước → gửi URL
}

