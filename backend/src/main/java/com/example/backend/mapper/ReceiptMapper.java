package com.example.backend.mapper;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.response.ResReceiptDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReceiptMapper {

    @Mapping(source = "supplier.id", target = "supplierId")
    @Mapping(source = "user.id", target = "userId")
    ResReceiptDTO toResReceiptDTO(Receipt receipt);
}