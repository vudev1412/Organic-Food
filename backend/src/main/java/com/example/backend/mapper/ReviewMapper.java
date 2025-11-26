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
    // 2. DTO -> Entity (Mới thêm vào)
    // MapStruct sẽ tự tạo: review.setProduct(new Product()); và set ID cho nó
    @Mapping(source = "productId", target = "product.id")
    @Mapping(source = "userId", target = "user.id")

    // Bỏ qua các trường không cần thiết khi tạo mới
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Review toReview(ResReviewDTO dto);
}
