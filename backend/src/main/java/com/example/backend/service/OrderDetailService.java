package com.example.backend.service;

import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqOrderDetail;
import com.example.backend.domain.response.ResOrderDetailDTO;
import com.example.backend.domain.response.ResOrderDetailFullDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface OrderDetailService {

    ResOrderDetailDTO createOrderDetail(ReqOrderDetail req);

    ResultPaginationDTO getAllOrderDetails(Specification<OrderDetail> spec, Pageable pageable);

    ResOrderDetailDTO getOrderDetailById(Long orderId, Long productId);

    ResOrderDetailDTO updateOrderDetail(Long orderId, Long productId, OrderDetail orderDetail);

    void deleteOrderDetail(Long orderId, Long productId);
}
