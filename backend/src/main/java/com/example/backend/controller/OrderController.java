package com.example.backend.controller;

import com.example.backend.domain.Order;
import com.example.backend.domain.response.ResOrderDTO;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ResOrderDTO> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.handleCreateOrder(order);
        return ResponseEntity.ok(orderService.handleGetOrderById(createdOrder.getId()));
    }

    @GetMapping
    public ResponseEntity<List<ResOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.handleGetAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResOrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.handleGetOrderById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResOrderDTO> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        return ResponseEntity.ok(orderService.handleUpdateOrder(id, order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.handleDeleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
