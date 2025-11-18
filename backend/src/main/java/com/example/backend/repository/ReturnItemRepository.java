package com.example.backend.repository;

import com.example.backend.domain.Return;
import com.example.backend.domain.ReturnItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ReturnItemRepository extends JpaRepository<ReturnItem, Long> {
    @Transactional
    void deleteAllByReturns(Return returns);
}
