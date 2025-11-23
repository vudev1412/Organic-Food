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
    @Mapping(source = "order.user.name", target = "customerName") // map customer name từ order.user
    ResReturnDTO toResReturnDTO(Return entity);

    Return toEntity(ReqReturnDTO dto);
}
