package com.example.backend.mapper;

import com.example.backend.domain.Product;
import com.example.backend.domain.ProductImage;
import com.example.backend.domain.Unit;
import com.example.backend.domain.request.ReqProductDTO;
import com.example.backend.domain.response.ResCertificateProductDTO;
import com.example.backend.domain.response.ResGetAllProductDTO;
import com.example.backend.domain.response.ResProductDTO;
import com.example.backend.domain.response.ResProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")

public interface ProductMapper {


    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "unit.name", target = "unit")
    ResProductDTO toBaseResProductDto(Product dto);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "unit.name", target = "unit")
    ResGetAllProductDTO toBaseResProductDTO(Product dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "unit", ignore = true)
    @Mapping(target = "productImages", ignore = true)
    @Mapping(target = "productCertificates", ignore = true)
    @Mapping(target = "orderDetails", ignore = true)
    @Mapping(target = "receiptDetails", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    @Mapping(target = "promotionDetails", ignore = true)
    @Mapping(target = "returnItems", ignore = true)
    Product toEntity(ReqProductDTO dto);

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

        List<ResProductImage> images = product.getProductImages() != null
                ? product.getProductImages().stream()
                .map(img -> {
                    ResProductImage res = new ResProductImage();
                    res.setId(img.getId());
                    res.setImgUrl(img.getImgUrl());
                    res.setProductId(
                            img.getProduct() != null ? img.getProduct().getId() : null
                    );
                    return res;
                })
                .toList()
                : null;

        dto.setImages(images);

        return dto;

   
    }


}
