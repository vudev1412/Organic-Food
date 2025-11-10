package com.example.backend.mapper;

import com.example.backend.domain.CartItem;
import com.example.backend.domain.response.ResCartItemDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(source = "product.id",target = "productId")
    @Mapping(source = "cart.id",target = "cartId")
    ResCartItemDTO toResCartItemDTO(CartItem cartItem);
}
