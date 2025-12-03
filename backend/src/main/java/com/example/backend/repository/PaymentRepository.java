package com.example.backend.repository;

import com.example.backend.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {
    @Query("""
    SELECT DISTINCT p FROM Payment p
    LEFT JOIN FETCH p.invoices i
    LEFT JOIN FETCH i.order o
    LEFT JOIN FETCH i.customer c
    LEFT JOIN FETCH i.employee e
    LEFT JOIN FETCH i.voucher v
""")
    List<Payment> findAllWithRelations();
}
