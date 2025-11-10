package com.example.backend.service.impl;

import com.example.backend.domain.CustomerAddress;
import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.request.ReqCustomerAddress;
import com.example.backend.domain.request.ReqCustomerProfile;
import com.example.backend.domain.response.ResCustomerAddress;
import com.example.backend.domain.response.ResCustomerProfile;
import com.example.backend.mapper.CustomerProfileMapper;
import com.example.backend.repository.CustomerAddressRepository;
import com.example.backend.repository.CustomerProfileRepository;
import com.example.backend.service.CustomerAddressService;
import com.example.backend.service.CustomerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerProfileServiceImpl implements CustomerProfileService {
    private final CustomerProfileRepository customerProfileRepository;
    private final CustomerProfileMapper customerProfileMapper;

    public CustomerProfile handleCreateCustomerProfile(CustomerProfile customerProfile) {
        return this.customerProfileRepository.save(customerProfile);
    }


    public void handleDeleteCustomerProfile(Long id) {
        this.customerProfileRepository.deleteById(id);
    }


    public List<ResCustomerProfile> handleGetAllCustomerProfile() {
        List<ResCustomerProfile> customerProfileList = this.customerProfileRepository.findAll().stream().map(customerProfileMapper::toResCustomerProfile).toList();
        return customerProfileList;
    }

    public ResCustomerProfile handleGetCustomerProfileById(Long id) {
        CustomerProfile customerProfile = this.customerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));
        return this.customerProfileMapper.toResCustomerProfile(customerProfile);
    }


    public ResCustomerProfile handleUpdateCustomerProfile(Long id, CustomerProfile customerProfile) {
        CustomerProfile currentProfile = this.customerProfileRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Not found with id:" + id));

        currentProfile.setMember(customerProfile.isMember());
        CustomerProfile saved = this.customerProfileRepository.save(currentProfile);

        return this.customerProfileMapper.toResCustomerProfile(saved);
    }
}
