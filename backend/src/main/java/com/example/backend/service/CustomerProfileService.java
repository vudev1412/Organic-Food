package com.example.backend.service;


import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqUpdateCustomerProfile;
import com.example.backend.domain.response.ResCustomerProfile;
import com.example.backend.domain.response.ResEmployeeProfile;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface CustomerProfileService {
    public CustomerProfile handleCreateCustomerProfile(CustomerProfile customerProfile);
    public void handleDeleteCustomerProfile(Long id);
    public ResultPaginationDTO handleGetAllCustomerProfile(Specification<CustomerProfile> spec, Pageable pageable);
    public CustomerProfile handleGetCustomerProfileById(Long id);
    public ResCustomerProfile handleUpdateCustomerProfile(Long id, ReqUpdateCustomerProfile customerProfile);
}
