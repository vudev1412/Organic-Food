package com.example.backend.repository;

import com.example.backend.domain.CustomerAddress;
import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE CustomerAddress a SET a.defaultAddress = false WHERE a.user.id = :userId")
    void resetDefaultAddressByUserId(Long userId);


    List<CustomerAddress> getCustomerAddressByUser_Id(Long customerId);

    @Transactional
    void deleteAllByUser(User user);
}
