package com.example.backend.mapper;

import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "role", target = "userRole")
    User toUser(ReqCreateUserDTO userDTO);

    ResUserDTO toResUserDTO(User user);
}
