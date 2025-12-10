package com.example.backend.controller;

import com.example.backend.domain.Order;
import com.example.backend.domain.request.CreateUserOrderDTO;
import com.example.backend.domain.request.ReqCreateOrderDTO;
import com.example.backend.domain.request.ReqUpdateOrderDTO;
import com.example.backend.domain.response.ResCreateUserOrderDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import  com.example.backend.util.SecurityUtil;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('NV ThuNgan') or hasAuthority('QL DonHang')")
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('NV ThuNgan') or hasAuthority('QL DonHang')")
    public ResponseEntity<ResOrderDTO> updateOrder(@PathVariable Long id, @RequestBody ReqUpdateOrderDTO order) {
        return ResponseEntity.ok(orderService.handleUpdateOrder(id, order));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NV ThuNgan') or hasAuthority('QL DonHang')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.handleDeleteOrder(id, false);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user-order/{id}")
    public ResponseEntity<List<ResOrderDTO>> getOrderByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(id));
    }
    // --- [LOGIC MỚI: THÊM API NÀY CHO USER CHECKOUT] ---
    @PostMapping("/place-order")
    @ApiMessage("Customer place an order")
    public ResponseEntity<ResCreateUserOrderDTO> placeUserOrder(@RequestBody CreateUserOrderDTO reqDTO) {
        // Gọi hàm handlePlaceUserOrder mới trong Service
        ResCreateUserOrderDTO newOrder = orderService.handlePlaceUserOrder(reqDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }
    // ----------------------------------------------------
    @GetMapping("/user/{id}")
    public ResponseEntity<ResOrderDTO> getOrderById2(@PathVariable Long id) {
        Order order = orderService.handleGetOrderById(id);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        ResOrderDTO resDTO = orderService.convertToResOrderDTOv2(order);
        return ResponseEntity.ok(resDTO);
    }
    /**
     * API hủy đơn hàng từ phía Khách hàng hoặc từ Frontend (Modal thanh toán)
     * Dùng POST vì nó là một hành động (action) thay đổi trạng thái.
     * Khách hàng không cần quyền, Service sẽ tự kiểm tra order có thuộc về user không.
     * Endpoint này sẽ được gọi từ PaymentModal.tsx
     * Ví dụ: POST /api/v1/orders/cancel/123
     */
    @PostMapping("/cancel/{id}")
    @ApiMessage("Cancel an order and refund inventory (by Customer or System)")
    public ResponseEntity<Void> cancelUserOrder(@PathVariable Long id) {
        // Lấy ID người dùng hiện tại (hoặc null nếu không cần kiểm tra quyền)
        // Trong trường hợp này, Service cần tự kiểm tra user ID.
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

    /**
     * API hủy đơn hàng từ phía Admin/Nhân viên
     * Cần có quyền 'QL DonHang' hoặc 'ADMIN'.
     * API này có thể có thêm logic ghi log người hủy.
     */
    @PatchMapping("/admin/cancel/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('QL DonHang')")
    @ApiMessage("Cancel an order (by Admin/Staff)")
    public ResponseEntity<Void> cancelOrderAdmin(@PathVariable Long id) {
        // Lấy thông tin người dùng hiện tại để ghi log nếu cần
        // String currentUser = SecurityUtil.getCurrentUserLogin().orElse("System");
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }
}
