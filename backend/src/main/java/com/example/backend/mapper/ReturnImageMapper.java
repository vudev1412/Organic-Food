package com.example.backend.mapper;

import com.example.backend.domain.ReturnImage;
import com.example.backend.domain.request.ReqReturnImageDTO;
import com.example.backend.domain.response.ResReturnImageDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReturnImageMapper {

    @Mapping(source = "returns.id", target = "returnId")
    ResReturnImageDTO toResReturnImageDTO(ReturnImage entity);

    default ReturnImage toEntity(ReqReturnImageDTO dto) {
        ReturnImage entity = new ReturnImage();
        entity.setImageUrl(dto.getImageUrl());
        entity.setUploadedAt(dto.getUploadedAt());
        return entity;
    }
}
