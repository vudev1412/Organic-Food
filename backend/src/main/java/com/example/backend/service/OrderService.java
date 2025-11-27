package com.example.backend.service;

import com.example.backend.domain.Order;
import com.example.backend.domain.request.ReqCreateOrderDTO;
import com.example.backend.domain.request.ReqUpdateOrderDTO;
import com.example.backend.domain.response.ResOrderDTO;
import com.example.backend.domain.response.ResOrdersDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface OrderService {
    ResOrderDTO handleCreateOrder(ReqCreateOrderDTO reqDTO);
    ResultPaginationDTO getAllOrders(Specification<Order> spec, Pageable pageable);
    Order handleGetOrderById(Long id);
    ResOrderDTO handleUpdateOrder(Long orderId, ReqUpdateOrderDTO reqDTO);
    void handleDeleteOrder(Long orderId, boolean hardDelete);
    List<ResOrderDTO> getOrdersByUserId(Long id);
}
