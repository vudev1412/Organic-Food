package com.example.backend.mapper;


import com.example.backend.domain.Certificate;
import com.example.backend.domain.response.ResCertificateDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CertificateMapper {
    ResCertificateDTO toResCertificateDTO(Certificate certificate);
}
