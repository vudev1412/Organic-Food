package com.example.backend.service.impl;

import com.example.backend.domain.Order;
import com.example.backend.domain.response.ResOrderDTO;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.repository.OrderRepository;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    public Order handleCreateOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public List<ResOrderDTO> handleGetAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResOrderDTO)
                .toList();
    }

    @Override
    public Order handleGetOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return order;
    }

    @Override
    public ResOrderDTO handleUpdateOrder(Long id, Order order) {
        Order currentOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        if (order.getOrderAt() != null) currentOrder.setOrderAt(order.getOrderAt());
        if (order.getNote() != null) currentOrder.setNote(order.getNote());
        if (order.getStatusOrder() != null) currentOrder.setStatusOrder(order.getStatusOrder());
        if (order.getShipAddress() != null) currentOrder.setShipAddress(order.getShipAddress());
        if (order.getEstimatedDate() != null) currentOrder.setEstimatedDate(order.getEstimatedDate());
        if (order.getActualDate() != null) currentOrder.setActualDate(order.getActualDate());

        orderRepository.save(currentOrder);

        return orderMapper.toResOrderDTO(currentOrder);
    }

    @Override
    public void handleDeleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public List<ResOrderDTO> handleGetOrderByUserId(Long id) {
        return this.orderRepository.findByUser_Id(id).stream().map(this.orderMapper::toResOrderDTO).toList();
    }
}
