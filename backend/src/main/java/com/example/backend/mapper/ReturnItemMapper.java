package com.example.backend.mapper;

import com.example.backend.domain.ReturnItem;
import com.example.backend.domain.request.ReqReturnItemDTO;
import com.example.backend.domain.response.ResReturnItemDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReturnItemMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "returns.id", target = "returnId")
    @Mapping(source = "product.name", target = "productName")
    ResReturnItemDTO toResReturnItemDTO(ReturnItem entity);

    default ReturnItem toEntity(ReqReturnItemDTO dto) {
        ReturnItem entity = new ReturnItem();
        entity.setQuantity(dto.getQuantity());
        entity.setAmountRefund(dto.getAmountRefund());
        entity.setNote(dto.getNote());
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
