package com.example.backend.repository;

import com.example.backend.domain.Order;
import com.example.backend.domain.Return;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ReturnRepository extends JpaRepository<Return, Long> {

    @Transactional
    void deleteAllByOrder(Order order);
}
