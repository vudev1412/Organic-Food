package com.example.backend.domain.response;


import com.example.backend.domain.Product;
import com.example.backend.domain.Unit;
import lombok.Builder;
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
    public ResProductDTO(Product p) {
        this.id = p.getId();
        this.name = p.getName();
        this.unit = p.getUnit() != null ? p.getUnit().getName() : null;
        this.price = p.getPrice();
        this.origin_address = p.getOrigin_address();
        this.description = p.getDescription();
        this.rating_avg = p.getRating_avg();
        this.quantity = p.getQuantity();
        this.slug = p.getSlug();
        this.image = p.getImage();

        this.active = p.isActive();
        this.mfgDate = p.getMfgDate();
        this.expDate = p.getExpDate();
        this.createAt = p.getCreateAt();
        this.updateAt = p.getUpdateAt();

        this.createBy = p.getCreateBy();
        this.updateBy = p.getUpdateBy();

        this.categoryId = p.getCategory() != null ? p.getCategory().getId() : null;
    }
    @Builder
    public ResProductDTO(Long id, String name, String unit, double price, String origin_address,
                         String description, double rating_avg, int quantity, String slug,
                         String image, boolean active, Instant mfgDate, Instant expDate,
                         Instant createAt, Instant updateAt, String createBy, String updateBy,
                         Long categoryId) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.price = price;
        this.origin_address = origin_address;
        this.description = description;
        this.rating_avg = rating_avg;
        this.quantity = quantity;
        this.slug = slug;
        this.image = image;
        this.active = active;
        this.mfgDate = mfgDate;
        this.expDate = expDate;
        this.createAt = createAt;
        this.updateAt = updateAt;
        this.createBy = createBy;
        this.updateBy = updateBy;
        this.categoryId = categoryId;
    }

}