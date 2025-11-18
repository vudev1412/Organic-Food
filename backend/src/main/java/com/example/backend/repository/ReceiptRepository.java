package com.example.backend.repository;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    @Transactional
    void deleteAllByUser(User user);
}
