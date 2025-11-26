package com.example.backend.repository;


import com.example.backend.domain.Order;
import com.example.backend.domain.OrderDetail;
import com.example.backend.domain.key.OrderDetailKey;
import com.example.backend.enums.StatusInvoice;
import com.example.backend.enums.StatusOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailKey>, JpaSpecificationExecutor<OrderDetail> {
    @Transactional
    void deleteAllByOrder(Order order);
    @Query("""
        SELECT CASE WHEN COUNT(od) > 0 THEN TRUE ELSE FALSE END
        FROM OrderDetail od
        JOIN od.order o
        JOIN o.invoice i
        WHERE od.product.id = :productId
          AND o.user.id = :userId
          AND i.status = :invoiceStatus
          AND o.statusOrder = :orderStatus 
    """)
    boolean existsByProductAndUserAndStatus(
            @Param("productId") long productId,
            @Param("userId") long userId,
            @Param("invoiceStatus") StatusInvoice invoiceStatus,
            @Param("orderStatus") StatusOrder orderStatus // Thêm tham số này
    );
    List<OrderDetail> findByOrderId(Long orderId);

}
