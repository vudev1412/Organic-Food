package com.example.backend.mapper;

import com.example.backend.domain.Order;
import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.response.ResOrderDTO;
import com.example.backend.domain.response.ResOrderDetailDTO;
import com.example.backend.domain.response.ResOrderDetalDTO;
import com.example.backend.domain.response.ResOrdersDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target="userId", source="user.id")
    ResOrdersDTO toResOrderDTO(Order order);




}
