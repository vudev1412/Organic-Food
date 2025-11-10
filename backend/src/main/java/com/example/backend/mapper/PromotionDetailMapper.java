package com.example.backend.mapper;

import com.example.backend.domain.PromotionDetail;
import com.example.backend.domain.request.ReqPromotionDetailDTO;
import com.example.backend.domain.response.ResPromotionDetailDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PromotionDetailMapper {

    @Mapping(source = "promotion.id", target = "promotionId")
    @Mapping(source = "product.id", target = "productId")
    ResPromotionDetailDTO toResPromotionDetailDTO(PromotionDetail entity);


    default PromotionDetail toEntity(ReqPromotionDetailDTO dto) {
        PromotionDetail entity = new PromotionDetail();
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        return entity;
    }

    void updateFromDTO(ReqPromotionDetailDTO dto, @MappingTarget PromotionDetail entity);
}
