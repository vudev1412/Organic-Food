package com.example.backend.controller;

import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqOrderDetail;
import com.example.backend.domain.response.ResOrderDetailDTO;
import com.example.backend.domain.response.ResOrderDetailFullDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.service.OrderDetailService;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    public ResponseEntity<ResultPaginationDTO> getAllOrderDetails(@Filter Specification<OrderDetail> spec, Pageable pageable) {
        return ResponseEntity.ok(orderDetailService.getAllOrderDetails(spec,pageable));
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
    @GetMapping("/order-details/order/{orderId}")
    public ResponseEntity<List<ResOrderDetailDTO>> getOrderDetailsByOrderId(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderDetailService.getOrderDetailsByOrderId(orderId));
    }

    // nếu muốn trả full DTO:
    @GetMapping("/order-details/order/{orderId}/full")
    public ResponseEntity<List<ResOrderDetailFullDTO>> getOrderDetailsByOrderIdFull(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderDetailService.getOrderDetailsByOrderIdFull(orderId));
    }
}
