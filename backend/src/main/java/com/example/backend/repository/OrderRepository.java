package com.example.backend.repository;

import com.example.backend.domain.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    List<Order> findByUser_Id(Long userId);

    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.orderDetails od " +
            "LEFT JOIN FETCH od.product p " +
            "LEFT JOIN FETCH o.user u")
    List<Order> findAllWithDetailsAndProducts();

    // ✅ Lấy orders với orderDetails và product (PAGEABLE) - Cách 1: Query 2 lần
    @Query(value = "SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.user u",
            countQuery = "SELECT COUNT(DISTINCT o) FROM Order o")
    Page<Order> findAllOrders(Pageable pageable);

    // ✅ Sau đó fetch orderDetails cho từng order
    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.orderDetails od " +
            "LEFT JOIN FETCH od.product p " +
            "WHERE o.id IN :orderIds")
    List<Order> findOrdersWithDetails(List<Long> orderIds);

    // ✅ Lấy 1 order cụ thể với đầy đủ thông tin
    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.orderDetails od " +
            "LEFT JOIN FETCH od.product p " +
            "LEFT JOIN FETCH o.user u " +
            "WHERE o.id = :orderId")
    Optional<Order> findOrderWithDetailsAndProduct(Long orderId);
}
