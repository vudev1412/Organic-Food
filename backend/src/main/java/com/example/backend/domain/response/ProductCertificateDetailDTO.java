package com.example.backend.domain.response;

import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ProductCertificateDetailDTO {

    // 1. ID Chứng chỉ
    private Long certificateId;

    // 2. Thông tin cơ bản về Chứng chỉ
    private String name;
    private String typeImageUrl;

    // 3. Thông tin chi tiết cho Sản phẩm
    private String certNo;
    private Instant date;
    private String specificImageUrl;

    // Constructor, Getters và Setters cần được thêm vào (thường dùng Lombok @Data hoặc @Value)
    // Ví dụ sử dụng Constructor để dễ mapping:

    public ProductCertificateDetailDTO(Long certificateId, String name, String typeImageUrl, String certNo, Instant date, String specificImageUrl) {
        this.certificateId = certificateId;
        this.name = name;
        this.typeImageUrl = typeImageUrl;
        this.certNo = certNo;
        this.date = date;
        this.specificImageUrl = specificImageUrl;
    }


}