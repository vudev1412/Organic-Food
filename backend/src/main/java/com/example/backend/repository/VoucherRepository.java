package com.example.backend.repository;

import com.example.backend.domain.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long>, JpaSpecificationExecutor<Voucher> {
    @Query("""
        SELECT v FROM Voucher v 
        WHERE v.active = true
        AND v.startDate <= :now
        AND v.endDate >= :now
        AND v.quantity > v.usedCount
        ORDER BY v.value DESC, v.endDate ASC
    """)
    List<Voucher> findAvailableVouchers(@Param("now") Instant now);
    Optional<Voucher> findByCode(String code);
}
