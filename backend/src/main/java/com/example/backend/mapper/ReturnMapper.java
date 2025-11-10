package com.example.backend.mapper;

import com.example.backend.domain.Return;
import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.response.ResReturnDTO;
import com.example.backend.enums.StatusReturn;
import com.example.backend.enums.TypeReturn;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReturnMapper {

    @Mapping(source = "order.id", target = "orderId")
    ResReturnDTO toResReturnDTO(Return entity);

    default Return toEntity(ReqReturnDTO dto) {
        Return entity = new Return();
        entity.setReason(dto.getReason());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : StatusReturn.PENDING);
        entity.setReturnType(dto.getReturnType() != null ? dto.getReturnType() : TypeReturn.REFUND);
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setApprovedAt(dto.getApprovedAt());
        entity.setProcessedBy(dto.getProcessedBy());
        entity.setProcessNote(dto.getProcessNote());
        return entity;
    }
}
