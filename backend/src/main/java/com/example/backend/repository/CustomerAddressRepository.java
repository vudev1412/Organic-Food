package com.example.backend.repository;

import com.example.backend.domain.CustomerAddress;
import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
    List<CustomerAddress> getCustomerAddressByUser_Id(Long customerId);

    @Transactional
    void deleteAllByUser(User user);
}
