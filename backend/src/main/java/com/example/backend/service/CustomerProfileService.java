package com.example.backend.service;


import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.response.ResCustomerProfile;

import java.util.List;

public interface CustomerProfileService {
    public CustomerProfile handleCreateCustomerProfile(CustomerProfile customerProfile);
    public void handleDeleteCustomerProfile(Long id);
    public List<ResCustomerProfile> handleGetAllCustomerProfile();
    public ResCustomerProfile handleGetCustomerProfileById(Long id);
    public ResCustomerProfile handleUpdateCustomerProfile(Long id, CustomerProfile customerProfile);
}
