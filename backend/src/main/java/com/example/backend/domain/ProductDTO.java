package com.example.backend.domain;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private double price;
    private String slug;
    private String image;
}