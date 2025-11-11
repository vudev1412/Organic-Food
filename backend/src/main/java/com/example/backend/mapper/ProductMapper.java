package com.example.backend.mapper;

import com.example.backend.domain.Product;
import com.example.backend.domain.request.ReqProductDTO;
import com.example.backend.domain.response.ResProductDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "active", source = "active")
    Product toEntity(ReqProductDTO dto);

    @Mapping(source = "category.id", target = "categoryId")
    ResProductDTO toResProductDto(Product dto);

}
