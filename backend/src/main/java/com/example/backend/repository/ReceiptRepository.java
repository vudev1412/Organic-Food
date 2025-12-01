package com.example.backend.repository;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long>, JpaSpecificationExecutor<Receipt> {
    @Transactional
    void deleteAllByUser(User user);

    @Query("SELECT DISTINCT r FROM Receipt r " +
            "JOIN FETCH r.supplier s " +
            "LEFT JOIN FETCH r.receiptDetails rd " +
            "LEFT JOIN FETCH rd.product p " +
            "LEFT JOIN FETCH r.user u")
    List<Receipt> findAllWithDetails();

    @Query("SELECT DISTINCT r FROM Receipt r " +
            "JOIN FETCH r.supplier s " +
            "LEFT JOIN FETCH r.receiptDetails rd " +
            "LEFT JOIN FETCH rd.product p " +
            "LEFT JOIN FETCH r.user u " +
            "WHERE r.id = :id")
    Receipt findByIdWithDetails(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query("DELETE FROM Receipt r WHERE r.id = :id")
    void deleteByIdCustom(@Param("id") Long id);



}
