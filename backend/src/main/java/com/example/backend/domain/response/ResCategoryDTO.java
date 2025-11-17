package com.example.backend.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCategoryDTO {
    private long id;
    private String name;
    private String slug;
    private Long parentCategoryId;
}
