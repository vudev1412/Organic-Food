package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqProductImage {
    private String imgUrl;
    private Long productId;
}
