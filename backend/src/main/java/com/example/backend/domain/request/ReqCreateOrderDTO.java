package com.example.backend.domain.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ReqCreateOrderDTO {
    private ReqCustomerDTO customerDTO;

    private Long userId;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    private String shipAddress;

    private String note;

    private Instant estimatedDate;

    @NotEmpty(message = "Đơn hàng phải có ít nhất 1 sản phẩm")
    private List<ReqOrderDetailItemDTO> orderDetails;

}
