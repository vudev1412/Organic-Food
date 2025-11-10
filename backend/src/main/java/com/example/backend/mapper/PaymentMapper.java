package com.example.backend.mapper;

import com.example.backend.domain.Payment;
import com.example.backend.domain.response.ResPaymentDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    ResPaymentDTO toResPaymentDTO(Payment payment);
}
