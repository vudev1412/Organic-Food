package com.example.backend.repository;

import com.example.backend.domain.ReceiptDetail;
import com.example.backend.domain.key.ReceiptDetailKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptDetailRepository extends JpaRepository<ReceiptDetail, ReceiptDetailKey> {
}
