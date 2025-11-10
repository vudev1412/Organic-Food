package com.example.backend.controller;


import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.response.ResCustomerProfile;
import com.example.backend.service.CustomerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CustomerProfileController {
    private final CustomerProfileService customerProfileService;

    @PostMapping("/customer/profile")
    public ResponseEntity<CustomerProfile> createCustomerProfile(@RequestBody CustomerProfile customerProfile){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.customerProfileService.handleCreateCustomerProfile(customerProfile));
    }

    @GetMapping("/customer/profile")
    public ResponseEntity<List<ResCustomerProfile>> getAllCustomerProfile(){
        return ResponseEntity.ok().body(this.customerProfileService.handleGetAllCustomerProfile());
    }

    @GetMapping("/customer/profile/{id}")
    public ResponseEntity<ResCustomerProfile> getCustomerProfileById(@PathVariable Long id){
        return ResponseEntity.ok().body(this.customerProfileService.handleGetCustomerProfileById(id));
    }

    @PatchMapping("/customer/profile/{id}")
    public ResponseEntity<ResCustomerProfile> updateCustomerProfile(@PathVariable Long id, CustomerProfile customerProfile){
        return ResponseEntity.ok().body(this.customerProfileService.handleUpdateCustomerProfile(id, customerProfile));
    }
    @DeleteMapping("/customer/profile/{id}")
    public ResponseEntity<Void> deleteCustomerProfile(@PathVariable Long id){
        this.customerProfileService.handleDeleteCustomerProfile(id);
        return ResponseEntity.noContent().build();
    }
}
