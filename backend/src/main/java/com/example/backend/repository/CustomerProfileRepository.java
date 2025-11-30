package com.example.backend.repository;

import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long>, JpaSpecificationExecutor<CustomerProfile> {
    CustomerProfile getCustomerProfileByUserId(Long id);
    Optional<CustomerProfile> findByMembershipPaymentId(long paymentId);
}
