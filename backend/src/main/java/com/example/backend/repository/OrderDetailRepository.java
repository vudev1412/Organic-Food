package com.example.backend.repository;


import com.example.backend.domain.Order;
import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.key.OrderDetailKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailKey> {
    @Transactional
    void deleteAllByOrder(Order order);
}
