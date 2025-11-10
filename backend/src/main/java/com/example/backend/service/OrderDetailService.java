package com.example.backend.service;

import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.request.ReqOrderDetail;
import com.example.backend.domain.response.ResOrderDetailDTO;

import java.util.List;

public interface OrderDetailService {

    ResOrderDetailDTO createOrderDetail(ReqOrderDetail req);

    List<ResOrderDetailDTO> getAllOrderDetails();

    ResOrderDetailDTO getOrderDetailById(Long orderId, Long productId);

    ResOrderDetailDTO updateOrderDetail(Long orderId, Long productId, OrderDetail orderDetail);

    void deleteOrderDetail(Long orderId, Long productId);
}
