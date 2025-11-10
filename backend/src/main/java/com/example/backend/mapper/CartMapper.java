package com.example.backend.mapper;

import com.example.backend.domain.Cart;
import com.example.backend.domain.response.ResCartDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {
    @Mapping(source = "user.id",target = "userId")
    ResCartDTO toResCartDTO(Cart cart);
}
