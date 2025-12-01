package com.example.backend.controller;

import com.example.backend.domain.request.ReturnRequestDTO;
import com.example.backend.domain.response.ReturnResponseDTO;
import com.example.backend.service.ReturnService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer/returns")
@RequiredArgsConstructor
public class CustomerReturnController {

    private final ReturnService returnService;
    private final UserService userService; // để lấy user hiện tại

    // === 1. Lấy danh sách return của user ===
    @GetMapping
    public List<ReturnResponseDTO> getMyReturns() {
        Long userId = userService.getCurrentUserId(); // giả sử có service lấy user hiện tại
        return returnService.getReturnsByUserId(userId);
    }

    // === 2. Xem chi tiết return ===
    @GetMapping("/{id}")
    public ReturnResponseDTO getMyReturn(@PathVariable Long id) {
        Long userId = userService.getCurrentUserId();
        return returnService.getReturnByIdForCustomer(id, userId);
    }



    // === 3. Tạo return cho đơn hàng của user ===
    @PostMapping
    public ReturnResponseDTO createReturn(@RequestBody ReturnRequestDTO request) {
        Long userId = userService.getCurrentUserId();

        // Kiểm tra order có thuộc về user này không
        if (!returnService.isOrderBelongToUser(request.getOrderId(), userId)) {
            throw new RuntimeException("Đơn hàng không thuộc về bạn");
        }

        return returnService.createReturn(request);
    }
}
