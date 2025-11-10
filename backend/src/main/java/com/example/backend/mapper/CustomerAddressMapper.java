package com.example.backend.mapper;

import com.example.backend.domain.CustomerAddress;
import com.example.backend.domain.response.ResCustomerAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerAddressMapper {
    @Mapping(source = "user.id", target = "userId")
    ResCustomerAddress toResCustomerAddress(CustomerAddress customerAddress);
}
