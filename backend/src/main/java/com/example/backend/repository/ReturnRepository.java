package com.example.backend.repository;

import com.example.backend.domain.Order;
import com.example.backend.domain.Return;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRepository extends JpaRepository<Return, Long>, JpaSpecificationExecutor<Return> {

    @Transactional
    void deleteAllByOrder(Order order);
    List<Return> findByOrderId(Long orderId);
    List<Return> findAllByOrderUserId(Long userId);
    Optional<Return> findByOrder_Id(Long orderId);
}
