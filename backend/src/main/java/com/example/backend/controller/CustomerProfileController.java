package com.example.backend.controller;


import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.Supplier;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqUpdateCustomerProfile;
import com.example.backend.domain.response.ResCustomerInfoDTO;
import com.example.backend.domain.response.ResCustomerProfile;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CustomerProfileService;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CustomerProfileController {
    private final CustomerProfileService customerProfileService;
    private final UserRepository userRepository;

    @PostMapping("/customer/profile")
    public ResponseEntity<CustomerProfile> createCustomerProfile(@RequestBody CustomerProfile customerProfile){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.customerProfileService.handleCreateCustomerProfile(customerProfile));
    }

    @GetMapping("/customer/profile")
    public ResponseEntity<ResultPaginationDTO> getAllCustomerProfile(@Filter Specification<CustomerProfile> spec,
                                                                     Pageable pageable){
        return ResponseEntity.ok().body(this.customerProfileService.handleGetAllCustomerProfile(spec,pageable));
    }

    @GetMapping("/customer/profile/{id}")
    public ResponseEntity<CustomerProfile> getCustomerProfileById(@PathVariable Long id){
        return ResponseEntity.ok().body(this.customerProfileService.handleGetCustomerProfileById(id));
    }

    @PutMapping("/customer/profile/{id}")
    public ResponseEntity<ResCustomerProfile> updateCustomerProfile(@PathVariable Long id,@RequestBody ReqUpdateCustomerProfile customerProfile){
        return ResponseEntity.ok().body(this.customerProfileService.handleUpdateCustomerProfile(id, customerProfile));
    }
    @DeleteMapping("/customer/profile/{id}")
    public ResponseEntity<Void> deleteCustomerProfile(@PathVariable Long id){
        this.customerProfileService.handleDeleteCustomerProfile(id);
        return ResponseEntity.noContent().build();
    }
    /**
     * API lấy thông tin chi tiết khách hàng theo User ID
     * URL: GET /api/v1/customers/info/{userId}
     */
    @GetMapping("customer/info/{userId}")
    public ResponseEntity<ResCustomerInfoDTO> getCustomerInfo(@PathVariable long userId) {
        // 1. Tìm User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Kiểm tra trạng thái Member
        CustomerProfile profile = user.getCustomerProfile();
        boolean isMember = false;

        // Chỉ cần check null và giá trị boolean
        if (profile != null) {
            isMember = profile.isMember();
        }

        // 3. Trả về DTO gọn nhẹ
        ResCustomerInfoDTO response = new ResCustomerInfoDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getImage(),
                isMember
        );

        return ResponseEntity.ok(response);
    }

}
