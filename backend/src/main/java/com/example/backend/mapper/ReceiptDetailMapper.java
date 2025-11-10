package com.example.backend.mapper;

import com.example.backend.domain.ReceiptDetail;
import com.example.backend.domain.request.ReqReceiptDetailDTO;
import com.example.backend.domain.response.ResReceiptDetailDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReceiptDetailMapper {

    @Mapping(source = "receipt.id", target = "receiptId")
    @Mapping(source = "product.id", target = "productId")
    ResReceiptDetailDTO toResReceiptDetailDTO(ReceiptDetail entity);

    default ReceiptDetail toEntity(ReqReceiptDetailDTO dto) {
        ReceiptDetail entity = new ReceiptDetail();
        entity.setQuantity(dto.getQuantity());
        entity.setImportPrice(dto.getImportPrice());
        return entity;
    }

    void updateFromDTO(ReqReceiptDetailDTO dto, @MappingTarget ReceiptDetail entity);
}
