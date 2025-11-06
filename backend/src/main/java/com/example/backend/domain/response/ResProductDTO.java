package com.example.backend.domain.response;


import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResProductDTO {
    private Long id;
    private String name;
    private String unit;
    private double price;
    private String origin_address;
    private String description;
    private double rating_avg;
    private int quantity;

    private String image;

    private boolean active;

    private Instant mfgDate;

    private Instant expDate;

    private Instant createAt;

    private Instant updateAt;

    private String createBy;

    private String updateBy;
    private Long categoryId;
    private String categoryName;
}