package com.example.backend.mapper;

import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.Unit;
import com.example.backend.domain.response.ProductCertificateDTO;
import com.example.backend.domain.response.ResProductCertificate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductCertificateMapper {
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "certificate.id", target = "certificateId")
    ResProductCertificate toResProductCertificate(ProductCertificate entity);

    @Mapping(source = "product", target = "product")
    @Mapping(source = "certificate", target = "certificate")
    ProductCertificateDTO toDTO(ProductCertificate pc);
    default String map(Unit unit) {
        if (unit == null) {
            return null;
        }
        return unit.getName();
    }
}