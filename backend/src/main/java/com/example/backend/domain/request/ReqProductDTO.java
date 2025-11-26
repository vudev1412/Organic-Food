package com.example.backend.domain.request;

import com.example.backend.domain.Unit;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ReqProductDTO {
    private String name;
    private double price;
    private String origin_address;
    private String description;
    private int quantity;
    private boolean active;
    private Long categoryId;
    private Long unitId;

    private String image;
    private Instant mfgDate;

    private Instant expDate;
    private List<String> productImages;


    private List<ReqProductCertificateDTO> certificates;


}
