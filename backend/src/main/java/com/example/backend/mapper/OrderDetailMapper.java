package com.example.backend.mapper;

import com.example.backend.domain.Order;
import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.Product;
import com.example.backend.domain.response.ResOrderDTO;
import com.example.backend.domain.response.ResOrderDetailDTO;
import com.example.backend.domain.response.ResOrderDetailFullDTO;
import com.example.backend.domain.response.ResProductDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {

    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "product.id", target = "productId")

    ResOrderDetailDTO toResOrderDetailDTO(OrderDetail entity);

    public static ResOrderDetailFullDTO toFullDTO(OrderDetail od) {
        Product p = od.getProduct();
        Order o = od.getOrder();

        ResProductDTO productDTO = ResProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())

                .origin_address(p.getOrigin_address())
                .description(p.getDescription())
                .rating_avg(p.getRating_avg())
                .quantity(p.getQuantity())
                .slug(p.getSlug())
                .image(p.getImage())
                .active(p.isActive())
                .mfgDate(p.getMfgDate())
                .expDate(p.getExpDate())
                .createAt(p.getCreateAt())
                .updateAt(p.getUpdateAt())
                .createBy(p.getCreateBy())
                .updateBy(p.getUpdateBy())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .build();

        ResOrderDTO orderDTO = ResOrderDTO.builder()
                .id(o.getId())
                .orderAt(o.getOrderAt())
                .note(o.getNote())
                .statusOrder(o.getStatusOrder())
                .shipAddress(o.getShipAddress())
                .estimatedDate(o.getEstimatedDate())
                .actualDate(o.getActualDate())
                .userId(o.getUser() != null ? o.getUser().getId() : null)
                .build();

        return ResOrderDetailFullDTO.builder()
                .orderId(o.getId())
                .productId(p.getId())
                .quantity(od.getQuantity())
                .price(od.getPrice())
                .product(productDTO)
                .order(orderDTO)
                .build();
    }

}
