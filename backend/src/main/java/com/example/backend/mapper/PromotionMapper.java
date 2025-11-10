package com.example.backend.mapper;

import com.example.backend.domain.Promotion;
import com.example.backend.domain.request.ReqPromotionDTO;
import com.example.backend.domain.response.ResPromotionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PromotionMapper {

    ResPromotionDTO toResPromotionDTO(Promotion entity);

    Promotion toPromotion(ReqPromotionDTO dto);

    void updatePromotionFromDTO(ReqPromotionDTO dto, @MappingTarget Promotion entity);
}
