package com.example.backend.mapper;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.response.ResReceiptDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReceiptMapper {


    ResReceiptDTO toResReceiptDTO(Receipt receipt);
}