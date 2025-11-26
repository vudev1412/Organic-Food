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
        // Nếu địa chỉ mới được đặt mặc định
        if(customerAddress.isDefaultAddress() && customerAddress.getUser() != null) {
            // Lấy tất cả địa chỉ cũ của user
            List<CustomerAddress> existingAddresses = customerAddressRepository
                    .getCustomerAddressByUser_Id(customerAddress.getUser().getId());

            // Set defaultAddress = false cho tất cả địa chỉ cũ
            for(CustomerAddress addr : existingAddresses) {
                addr.setDefaultAddress(false);
            }

            // Lưu các địa chỉ cũ
            customerAddressRepository.saveAll(existingAddresses);
        }

        // Lưu địa chỉ mới
        return customerAddressRepository.save(customerAddress);
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

    @Override
    public List<ResCustomerAddress> handleGetAllCustomerAddressByUserId(Long id) {
        return this.customerAddressRepository.getCustomerAddressByUser_Id(id)
                .stream()
                .map(this.customerAddressMapper::toResCustomerAddress)
                .toList();
    }
    @Override
    public ResCustomerAddress handleSetDefaultAddress(Long id) {
        CustomerAddress addr = customerAddressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id: " + id));

        Long userId = addr.getUser().getId();

        // Reset tất cả địa chỉ khác của user
        customerAddressRepository.resetDefaultAddressByUserId(userId);

        // Set địa chỉ này thành mặc định
        addr.setDefaultAddress(true);
        CustomerAddress saved = customerAddressRepository.save(addr);

        return customerAddressMapper.toResCustomerAddress(saved);
    }

}
