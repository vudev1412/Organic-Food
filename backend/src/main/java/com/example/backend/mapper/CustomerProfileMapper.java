package com.example.backend.mapper;


import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.response.ResCustomerProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerProfileMapper {
    @Mapping(source = "user.id",target = "userId")
    ResCustomerProfile toResCustomerProfile(CustomerProfile customerProfile);
}
