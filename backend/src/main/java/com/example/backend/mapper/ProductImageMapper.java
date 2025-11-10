package com.example.backend.mapper;

import com.example.backend.domain.ProductImage;
import com.example.backend.domain.response.ResProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {
    @Mapping(source = "product.id", target = "productId")
    ResProductImage toResProductImage(ProductImage productImage);
}
