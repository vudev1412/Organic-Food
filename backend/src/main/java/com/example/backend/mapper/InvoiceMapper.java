package com.example.backend.mapper;

import com.example.backend.domain.Invoice;
import com.example.backend.domain.response.ResInvoiceDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "employee.id", target = "employeeId")
    @Mapping(source = "payment.id", target = "paymentId")
    @Mapping(source = "voucher.id", target = "voucherId")
    ResInvoiceDTO toResInvoiceDTO(Invoice entity);
}
