package com.example.backend.domain;


import com.example.backend.enums.StockStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "products")
@Setter
@Getter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "name không được để trống")
    private String name;

    private String unit;

    private double price;

    private String origin_address;

    @Column(columnDefinition = "MEDIUMTEXT")
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    @PrePersist
    public void handleCreateAt(){
        this.createBy = "lehienvu";
        this.createAt = Instant.now();
    }

}
