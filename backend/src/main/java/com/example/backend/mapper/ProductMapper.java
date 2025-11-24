package com.example.backend.mapper;

import com.example.backend.domain.Product;
import com.example.backend.domain.Unit;
import com.example.backend.domain.request.ReqProductDTO;
import com.example.backend.domain.response.ResCertificateProductDTO;
import com.example.backend.domain.response.ResGetAllProductDTO;
import com.example.backend.domain.response.ResProductDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")

public interface ProductMapper {
    @Mapping(target = "active", source = "active")
    Product toEntity(ReqProductDTO dto);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "unit.name", target = "unit")
    ResProductDTO toBaseResProductDto(Product dto);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "unit.name", target = "unit")
    ResGetAllProductDTO toBaseResProductDTO(Product dto);


    default ResGetAllProductDTO toResProductDto(Product product) {
        ResGetAllProductDTO dto = toBaseResProductDTO(product);
        List<ResCertificateProductDTO> certificateDTOs = product.getProductCertificates()
                .stream()
                .map(pc -> ResCertificateProductDTO.builder()
                        .id(pc.getCertificate().getId())
                        .name(pc.getCertificate().getName())
                        .image(pc.getCertificate().getImage())
                        .certNo(pc.getCertNo())
                        .imageUrl(pc.getImageUrl())
                        .date(pc.getDate())
                        .build()
                ).toList();

        dto.setCertificates(certificateDTOs);

        return dto;
    }
}
