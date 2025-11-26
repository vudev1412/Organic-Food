package com.example.backend.domain.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
public class ResGetAllProductDTO {
    private Long id;
    private String name;
    private String unit;
    private double price;
    private String origin_address;
    private String description;
    private double rating_avg;
    private int quantity;
    private String slug;
    private String image;
    private boolean active;

    private Instant mfgDate;
    private Instant expDate;
    private Instant createAt;
    private Instant updateAt;

    private String createBy;
    private String updateBy;
    private Long categoryId;

    private List<ResCertificateProductDTO> certificates;

    private List<ResProductImage> images;
}
