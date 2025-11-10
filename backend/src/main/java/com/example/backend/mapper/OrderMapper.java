package com.example.backend.mapper;

import com.example.backend.domain.Order;
import com.example.backend.domain.response.ResOrderDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(source = "user.id", target = "userId")
    ResOrderDTO toResOrderDTO(Order order);
}
