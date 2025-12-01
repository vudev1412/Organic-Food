package com.example.backend.controller;

import com.example.backend.domain.Order;
import com.example.backend.domain.response.DashboardStatsDTO;
import com.example.backend.domain.response.TopSellingProductDTO;
import com.example.backend.enums.StatusOrder;
import com.example.backend.repository.OrderRepository;
import com.example.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final OrderRepository orderRepository;

    @GetMapping("/stats/new-customers")
    public ResponseEntity<?> getNewCustomers(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(dashboardService.getNewCustomersInMonth(month, year));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(dashboardService.getOrderInMonth(month, year));
    }

    @GetMapping("/top-selling")
    public ResponseEntity<List<TopSellingProductDTO>> getTopSellingProducts(
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam(defaultValue = "10") int top
    ) {
        List<TopSellingProductDTO> topProducts = dashboardService.getTopSellingProductsInMonth(month, year, top);
        return ResponseEntity.ok(topProducts);
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<Long>> getMonthlyRevenue(@RequestParam int year) {
        List<Long> revenue = dashboardService.getRevenueOfYear(year);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/orders/recent")
    public List<OrderDTO> getRecentOrders() {
        List<Order> orders = orderRepository.findTop10ByStatusOrderOrderByOrderAtDesc(StatusOrder.DELIVERED);
        return orders.stream().map(order -> new OrderDTO(
                order.getId(),
                order.getUser().getName(),
                order.getInvoice() != null ? order.getInvoice().getTotal() : 0,
                order.getStatusOrder().name()
        )).toList();
    }
    public record OrderDTO(Long id, String customer, Double total, String status) {}


}
