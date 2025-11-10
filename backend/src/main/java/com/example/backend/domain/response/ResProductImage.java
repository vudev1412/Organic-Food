package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResProductImage {
    private Long id;
    private String imgUrl;
    private Long productId;
}
