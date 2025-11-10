package com.example.backend.controller;

import com.example.backend.domain.CustomerAddress;
import com.example.backend.domain.request.ReqCustomerAddress;
import com.example.backend.domain.response.ResCustomerAddress;
import com.example.backend.service.CustomerAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CustomerAddressController {
    private final CustomerAddressService customerAddressService;

    @GetMapping("/address")
    public ResponseEntity<List<ResCustomerAddress>> getAllCustomerAddress(){
        List<ResCustomerAddress> customerAddressList = this.customerAddressService.handleGetAllCustomerAddress();
        return ResponseEntity.ok().body(customerAddressList);
    }
    @PostMapping("/address")
    public ResponseEntity<CustomerAddress> createCustomerAddress(@RequestBody CustomerAddress customerAddress){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.customerAddressService.handleCreateCustomerAddress(customerAddress));
    }
    @GetMapping("/address/{id}")
    public ResponseEntity<ResCustomerAddress> getCustomerAddressById(@PathVariable Long id){
        ResCustomerAddress customerAddress = this.customerAddressService.handleGetCustomerAddressById(id);
        return ResponseEntity.ok().body(customerAddress);
    }
    @DeleteMapping("/address/{id}")
    public ResponseEntity<Void> deleteCustomerAddress(@PathVariable Long id){
        this.customerAddressService.handleDeleteCustomerAddress(id);
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/address/{id}")
    public ResponseEntity<ResCustomerAddress> updateCustomerAddress(@PathVariable Long id,@RequestBody ReqCustomerAddress customerAddress){
        return ResponseEntity.ok().body(this.customerAddressService.handleUpdateCustomerAddress(id,customerAddress));
    }

}
