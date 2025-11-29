package com.example.backend.controller;

import com.example.backend.domain.Order;
import com.example.backend.domain.request.ReqCreateOrderDTO;
import com.example.backend.domain.request.ReqUpdateOrderDTO;
import com.example.backend.domain.response.ResOrderDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.service.OrderService;
import com.example.backend.util.annotation.ApiMessage;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import  com.example.backend.util.SecurityUtil;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ResOrderDTO> createOrder( @Valid @RequestBody ReqCreateOrderDTO reqDTO) {
        ResOrderDTO createdOrder = orderService.handleCreateOrder(reqDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @GetMapping
    @ApiMessage("Fetch all orders with pagination")
    public ResponseEntity<ResultPaginationDTO> getAllOrders(
            @Filter Specification<Order> spec,
            Pageable pageable) {

        return ResponseEntity.ok(orderService.getAllOrders(spec, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.handleGetOrderById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResOrderDTO> updateOrder(@PathVariable Long id, @RequestBody ReqUpdateOrderDTO order) {
        return ResponseEntity.ok(orderService.handleUpdateOrder(id, order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.handleDeleteOrder(id, false);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user-order/{id}")
    public ResponseEntity<List<ResOrderDTO>> getOrderByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(id));
    }
}
