package com.example.backend.service;

import com.example.backend.domain.CustomerAddress;
import com.example.backend.domain.request.ReqCustomerAddress;
import com.example.backend.domain.response.ResCustomerAddress;

import java.util.List;

public interface CustomerAddressService {
    public CustomerAddress handleCreateCustomerAddress(CustomerAddress customerAddress);

    public ResCustomerAddress handleGetCustomerAddressById(Long id);
    public void handleDeleteCustomerAddress(Long id);
    public ResCustomerAddress handleUpdateCustomerAddress(Long id, ReqCustomerAddress customerAddress);

    public List<ResCustomerAddress> handleGetAllCustomerAddress();
}
