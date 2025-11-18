package com.example.backend.service.impl;

import com.example.backend.domain.CustomerAddress;
import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.Supplier;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCustomerAddress;
import com.example.backend.domain.request.ReqCustomerProfile;
import com.example.backend.domain.request.ReqUpdateCustomerProfile;
import com.example.backend.domain.response.*;
import com.example.backend.mapper.CustomerProfileMapper;
import com.example.backend.repository.CustomerAddressRepository;
import com.example.backend.repository.CustomerProfileRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CustomerAddressService;
import com.example.backend.service.CustomerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerProfileServiceImpl implements CustomerProfileService {
    private final CustomerProfileRepository customerProfileRepository;
    private final CustomerProfileMapper customerProfileMapper;
    private final UserRepository userRepository;
    public CustomerProfile handleCreateCustomerProfile(CustomerProfile customerProfile) {
        return this.customerProfileRepository.save(customerProfile);
    }


    public void handleDeleteCustomerProfile(Long id) {

        CustomerProfile profile = customerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer profile not found: " + id));

        User user = profile.getUser();
        customerProfileRepository.delete(profile);
        if (user != null) {
            userRepository.delete(user);
        }
    }

    @Override
    public ResultPaginationDTO handleGetAllCustomerProfile(Specification<CustomerProfile> spec, Pageable pageable) {
        Page<CustomerProfile> pageSupplier = this.customerProfileRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageSupplier.getTotalPages());
        meta.setTotal(pageSupplier.getTotalElements());

        rs.setMeta(meta);

        List<CustomerProfile> list = pageSupplier.getContent();


        rs.setResult(list);
        return rs;
    }




    public CustomerProfile handleGetCustomerProfileById(Long id) {
        CustomerProfile customerProfile = this.customerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));

        return customerProfile;
    }


    public ResCustomerProfile handleUpdateCustomerProfile(Long id, ReqUpdateCustomerProfile req) {

        CustomerProfile currentProfile = customerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer profile not found: " + id));

        User currentUser = currentProfile.getUser();

        if (req.getUser() != null) {
            if (req.getUser().getName() != null) currentUser.setName(req.getUser().getName());
            if (req.getUser().getPhone() != null) currentUser.setPhone(req.getUser().getPhone());
            if (req.getUser().getImage() != null) currentUser.setImage(req.getUser().getImage());
            if (req.getUser().getEmail() != null) currentUser.setEmail(req.getUser().getEmail());

            userRepository.save(currentUser);
        }

        if (req.getMember() != null) {
            currentProfile.setMember(req.getMember());
        }

        customerProfileRepository.save(currentProfile);

        return customerProfileMapper.toResCustomerProfile(currentProfile);
    }




}
