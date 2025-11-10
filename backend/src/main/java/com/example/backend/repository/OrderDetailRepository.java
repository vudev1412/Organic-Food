package com.example.backend.repository;


import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.key.OrderDetailKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailKey> {
}
