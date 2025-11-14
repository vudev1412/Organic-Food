package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCategoryDTO {
    private String name;
    private String slug;
    private Long parentCategoryId;
}
