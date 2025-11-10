package com.example.backend.repository;

import com.example.backend.domain.CustomerAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
}
