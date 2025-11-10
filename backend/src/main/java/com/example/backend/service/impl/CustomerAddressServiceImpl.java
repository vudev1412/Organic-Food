package com.example.backend.service.impl;

import com.example.backend.domain.CustomerAddress;
import com.example.backend.domain.request.ReqCustomerAddress;
import com.example.backend.domain.response.ResCustomerAddress;
import com.example.backend.mapper.CustomerAddressMapper;
import com.example.backend.repository.CustomerAddressRepository;
import com.example.backend.service.CustomerAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerAddressServiceImpl implements CustomerAddressService {
    private final CustomerAddressRepository customerAddressRepository;
    private final CustomerAddressMapper customerAddressMapper;

    public CustomerAddress handleCreateCustomerAddress(CustomerAddress customerAddress){
        return this.customerAddressRepository.save(customerAddress);
    }

    public ResCustomerAddress handleGetCustomerAddressById(Long id){
        ResCustomerAddress customerAddress = this.customerAddressRepository.findById(id).map(customerAddressMapper::toResCustomerAddress)
                .orElseThrow(() -> new RuntimeException("Not found with id" + id));
        return customerAddress;
    }
    public void handleDeleteCustomerAddress(Long id){
        this.customerAddressRepository.deleteById(id);
    }
    public ResCustomerAddress handleUpdateCustomerAddress(Long id, ReqCustomerAddress customerAddress){
        CustomerAddress currentAddress = this.customerAddressRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Not found with id:" + id));

        currentAddress.setPhone(customerAddress.getPhone());
        currentAddress.setReceiverName(customerAddress.getReceiverName());
        currentAddress.setProvince(customerAddress.getProvince());
        currentAddress.setDistrict(customerAddress.getDistrict());
        currentAddress.setWard(customerAddress.getWard());
        currentAddress.setStreet(customerAddress.getStreet());
        currentAddress.setNote(customerAddress.getNote());
        currentAddress.setDefaultAddress(customerAddress.isDefaultAddress());

        CustomerAddress saveAddress = this.customerAddressRepository.save(currentAddress);
        return this.customerAddressMapper.toResCustomerAddress(saveAddress);
    }

    public List<ResCustomerAddress> handleGetAllCustomerAddress(){
        return this.customerAddressRepository.findAll().stream().map(customerAddressMapper::toResCustomerAddress).toList();
    }
}
