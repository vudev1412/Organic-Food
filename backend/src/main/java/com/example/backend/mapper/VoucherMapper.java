package com.example.backend.mapper;

import com.example.backend.domain.Voucher;
import com.example.backend.domain.response.ResVoucherDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VoucherMapper {
    ResVoucherDTO toResVoucherDTO(Voucher voucher);
}
