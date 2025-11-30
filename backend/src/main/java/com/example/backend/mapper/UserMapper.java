package com.example.backend.mapper;

import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface UserMapper {

  
    User toUser(ReqCreateUserDTO userDTO);



    ResUserDTO toResUserDTO(User user);
}
