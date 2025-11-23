package com.example.backend.service;

import com.example.backend.domain.Order;
import com.example.backend.domain.response.ResOrderDTO;

import java.util.List;

public interface OrderService {
    Order handleCreateOrder(Order order);
    List<ResOrderDTO> handleGetAllOrders();
    Order handleGetOrderById(Long id);
    ResOrderDTO handleUpdateOrder(Long id, Order order);
    void handleDeleteOrder(Long id);
    List<ResOrderDTO> handleGetOrderByUserId(Long id);
}
