package com.example.backend.repository;

import com.example.backend.domain.Invoice;
import com.example.backend.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE Invoice i SET i.customer = NULL WHERE i.customer.id = :customerId")
    void clearCustomerReference(Long customerId);

    @Modifying
    @Transactional
    @Query("UPDATE Invoice i SET i.employee = NULL WHERE i.employee.id = :employeeId")
    void clearEmployeeReference(Long employeeId);

    @Transactional
    void deleteByOrder(Order order);
    // Dùng để tìm Invoice theo Order ID (Lúc tạo QR)
    Optional<Invoice> findByOrderId(Long orderId);

    // Dùng để tìm Invoice theo Payment ID (Lúc Webhook báo về)
    Optional<Invoice> findByPaymentId(Long paymentId);
}
