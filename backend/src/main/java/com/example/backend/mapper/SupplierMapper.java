package com.example.backend.mapper;

import com.example.backend.domain.Supplier;
import com.example.backend.domain.response.ResSupplierDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    ResSupplierDTO toResSupplierDTO(Supplier supplier);
}
