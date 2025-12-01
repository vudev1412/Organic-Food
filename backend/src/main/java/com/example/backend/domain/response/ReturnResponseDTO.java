package com.example.backend.domain.response;

import com.example.backend.domain.ImageDTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Data
public class ReturnResponseDTO {
    private Long id;
    private String reason;
    private String status;
    private String returnType;
    private Instant createdAt;

    private List<ReturnItemResponseDTO> items;
    private List<ImageDTO> imageUrls; // lưu danh sách ảnh
}

