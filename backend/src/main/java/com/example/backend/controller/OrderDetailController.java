package com.example.backend.controller;

import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.request.ReqOrderDetail;
import com.example.backend.domain.response.ResOrderDetailDTO;
import com.example.backend.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    @PostMapping("/order-details")
    public ResponseEntity<ResOrderDetailDTO> createOrderDetail(@RequestBody ReqOrderDetail req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderDetailService.createOrderDetail(req));
    }

    @GetMapping("/order-details")
    public ResponseEntity<List<ResOrderDetailDTO>> getAllOrderDetails() {
        return ResponseEntity.ok(orderDetailService.getAllOrderDetails());
    }

    @GetMapping("/order-details/{orderId}/{productId}")
    public ResponseEntity<ResOrderDetailDTO> getOrderDetailById(@PathVariable Long orderId,
                                                                @PathVariable Long productId) {
        return ResponseEntity.ok(orderDetailService.getOrderDetailById(orderId, productId));
    }

    @PatchMapping("/order-details/{orderId}/{productId}")
    public ResponseEntity<ResOrderDetailDTO> updateOrderDetail(@PathVariable Long orderId,
                                                               @PathVariable Long productId,
                                                               @RequestBody OrderDetail orderDetail) {
        return ResponseEntity.ok(orderDetailService.updateOrderDetail(orderId, productId, orderDetail));
    }

    @DeleteMapping("/order-details/{orderId}/{productId}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long orderId,
                                                  @PathVariable Long productId) {
        orderDetailService.deleteOrderDetail(orderId, productId);
        return ResponseEntity.noContent().build();
    }
}
