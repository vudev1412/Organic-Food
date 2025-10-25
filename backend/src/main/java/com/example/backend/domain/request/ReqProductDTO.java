package com.example.backend.domain.request;

import com.example.backend.enums.StockStatus;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqProductDTO {
    private Long id;
    private String name;
    private String unit;
    private double price;
    private String origin_address;
    private String description;
    private double rating_avg;
    private int quantity;

    private String image;

    private Instant mfgDate;

    private Instant expDate;

    private Instant createAt;

    private Instant updateAt;

    private String createBy;

    private String updateBy;
    private Long categoryId;


}
