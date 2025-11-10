package com.example.backend.mapper;


import com.example.backend.domain.Review;
import com.example.backend.domain.response.ResReviewDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "user.id", target = "userId")
    ResReviewDTO toResReviewDTO(Review review);
}
