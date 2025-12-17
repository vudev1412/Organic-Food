package com.example.backend.mapper;

import com.example.backend.domain.Promotion;
import com.example.backend.domain.request.ReqCreatePromotionDTO;
import com.example.backend.domain.request.ReqPromotionDTO;
import com.example.backend.domain.response.ResPromotionDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PromotionMapper {

    ResPromotionDTO toResPromotionDTO(Promotion entity);

    Promotion toPromotion(ReqPromotionDTO dto);

    Promotion toPromotionCreate(ReqCreatePromotionDTO dto);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePromotionFromDTO(ReqPromotionDTO dto, @MappingTarget Promotion promotion);
}
