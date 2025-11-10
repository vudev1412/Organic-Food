package com.example.backend.mapper;

import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.response.ResProductCertificate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductCertificateMapper {
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "certificate.id", target = "certificateId")
    ResProductCertificate toResProductCertificate(ProductCertificate entity);
}