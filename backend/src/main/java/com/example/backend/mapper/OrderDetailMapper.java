package com.example.backend.mapper;

import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.response.ResOrderDetailDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {

    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "product.id", target = "productId")
    ResOrderDetailDTO toResOrderDetailDTO(OrderDetail entity);
}
