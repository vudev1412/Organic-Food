package com.example.backend.service;

import com.example.backend.domain.response.DashboardStatsDTO;
import com.example.backend.domain.response.TopSellingProductDTO;
import com.example.backend.repository.OrderDetailRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    public Long getNewCustomersInMonth(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        Instant start = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant end = endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        return userRepository.countNewCustomersBetween(start, end);
    }

    public Long getOrderInMonth(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        Instant start = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant end = endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        return orderRepository.countOrdersBetween(start, end);
    }

    public List<TopSellingProductDTO> getTopSellingProductsInMonth(int month, int year, int top) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        Instant start = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant end = endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<Object[]> results = orderDetailRepository.findTopSellingProductsInPeriod(start, end);

        return results.stream()
                .limit(top)
                .map(r -> new TopSellingProductDTO(
                        ((Number) r[0]).longValue(), // productId
                        (String) r[1],               // productName
                        ((Number) r[2]).intValue()   // quantitySold
                ))
                .toList();


    }
    public List<Long> getRevenueOfYear(int year) {
        List<Object[]> results = orderDetailRepository.getMonthlyRevenue(year);
        Long[] revenue = new Long[12];
        Arrays.fill(revenue, 0L);

        for(Object[] r : results) {
            int month = ((Integer) r[0]) - 1; // convert 1-12 -> 0-11
            revenue[month] = ((Number) r[1]).longValue();
        }

        return Arrays.asList(revenue);
    }


}
