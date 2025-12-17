package com.example.backend.mapper;

import com.example.backend.domain.Return;
import com.example.backend.domain.ReturnImage;
import com.example.backend.domain.ReturnItem;
import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.response.ResGetAllReturnDTO;
import com.example.backend.domain.response.ResReturnDTO;
import com.example.backend.domain.response.ResReturnImageDTO;
import com.example.backend.domain.response.ResReturnItemDTO;
import com.example.backend.enums.StatusReturn;
import com.example.backend.enums.TypeReturn;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring")
@Component
public interface ReturnMapper {


    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "order.user.name", target = "customerName") // map customer name từ order.user
    ResReturnDTO toResReturnDTO(Return entity);

    Return toEntity(ReqReturnDTO dto);

    default ResGetAllReturnDTO toResGetAllReturnDTO(Return r) {
        return ResGetAllReturnDTO.builder()
                .id(r.getId())
                .reason(r.getReason())
                .status(r.getStatus())
                .returnType(r.getReturnType())
                .createdAt(r.getCreatedAt())
                .approvedAt(r.getApprovedAt())
                .processedBy(r.getProcessedBy())
                .processNote(r.getProcessNote())
                .orderId(
                        r.getOrder() != null ? r.getOrder().getId() : null
                )
                .returnItems(
                        r.getReturnItems() != null
                                ? r.getReturnItems().stream()
                                .map(this::toResReturnItemDTO)
                                .toList()
                                : List.of()
                )
                .returnImages(
                        r.getReturnImages() != null
                                ? r.getReturnImages().stream()
                                .map(this::toResReturnImageDTO)
                                .toList()
                                : List.of()
                )
                .build();
    }

    // MapStruct sẽ inject mapper con
    ResReturnItemDTO toResReturnItemDTO(ReturnItem entity);

    ResReturnImageDTO toResReturnImageDTO(ReturnImage entity);



}
