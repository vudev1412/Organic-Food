package com.example.backend.mapper;

import com.example.backend.domain.Category;
import com.example.backend.domain.response.ResCategoryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "parentCategoryId", source = "parentCategory.id")
    ResCategoryDTO toResCategoryDTO(Category category);
}
