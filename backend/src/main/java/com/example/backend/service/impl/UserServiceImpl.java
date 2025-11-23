package com.example.backend.service.impl;

import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.Order;
import com.example.backend.domain.Return;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCreateUserDTO;
import com.example.backend.domain.request.ReqUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.enums.Role;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.*;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final ReturnRepository returnRepository;
    private final ReviewRepository reviewRepository;
    private final ReceiptRepository receiptRepository;
    private final InvoiceRepository invoiceRepository;
    private final ReturnItemRepository returnItemRepository;
    private final ReturnImageRepository returnImageRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CustomerAddressRepository customerAddressRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final EmployeeProfileRepository employeeProfileRepository;

    public boolean isEmailExist(String email){
        return this.userRepository.existsByEmail(email);
    }

    @Override
    public boolean isPhoneExist(String phone) {
        return this.userRepository.existsByPhone(phone);
    }

    @Override
    public ResUserDTO handleCreateUser(ReqCreateUserDTO user) {
        User entity = mapper.toUser(user);

        if (entity.getUserRole() == null && user.getRole() != null) {
            entity.setUserRole(Role.valueOf(user.getRole()));
        }

        // Save entity
        User saved = userRepository.save(entity);

        // Nếu muốn trả về DTO
        // return userMapper.toResUserDTO(saved);
        return mapper.toResUserDTO(saved);
    }


    public ResultPaginationDTO handleGetAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(spec,pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageUser.getContent());

        List<ResUserDTO> listUser = pageUser.getContent()
                .stream().map(item -> new ResUserDTO(
                        item.getId(),
                        item.getName(),
                        item.getEmail(),
                        item.getPhone()
                )).collect(Collectors.toList());

        rs.setResult(listUser);
        return rs;
    }

    public Optional<User> handleGetUserById(Long id){
        return userRepository.findById(id);
    }

    public User handleUpdateUser(Long id, ReqUserDTO user){
        Optional<User> myUser = this.handleGetUserById(id);
        if(myUser.isPresent()){
            User userCurr = myUser.get();
            if(userCurr.getName() != null){
                userCurr.setName(user.getName());
            }
            if(userCurr.getEmail() != null){
                userCurr.setEmail(user.getEmail());
            }
            if(userCurr.getPhone() != null){
                userCurr.setPhone(user.getPhone());
            }

            this.userRepository.save(userCurr);
            return userCurr;
        }
        return null;
    }

    public ResCreateUserDTO convertToResCreateUserDTO(User user){
        ResCreateUserDTO resCreateUserDTO = new ResCreateUserDTO();
        resCreateUserDTO.setName(user.getName());
        resCreateUserDTO.setEmail(user.getEmail());
        resCreateUserDTO.setPhone(user.getPhone());
        return resCreateUserDTO;
    }

    @Transactional
    public String handleDeleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Xóa reviews
        reviewRepository.deleteAllByUser(user);

        // 2. Xóa receipts
        receiptRepository.deleteAllByUser(user);

        // 3. Xóa invoice customer + employee
        invoiceRepository.clearCustomerReference(user.getId());
        invoiceRepository.clearEmployeeReference(user.getId());

        // 4. Xóa orders và tất cả return liên quan
        for (Order order : user.getOrders()) {
            // Xóa return trước
            for (Return r : order.getReturns()) {
                returnItemRepository.deleteAllByReturns(r);
                returnImageRepository.deleteAllByReturns(r);
            }
            returnRepository.deleteAllByOrder(order);

            // Xóa orderDetails
            orderDetailRepository.deleteAllByOrder(order);

            // Xóa invoice
            invoiceRepository.deleteByOrder(order);

            // Xóa order
            orderRepository.delete(order);
        }

        // 5. Xóa cart
        if (user.getCart() != null) cartRepository.delete(user.getCart());

        // 6. Xóa address
        customerAddressRepository.deleteAllByUser(user);

        // 7. Xóa customerProfile / employeeProfile
        if (user.getCustomerProfile() != null) customerProfileRepository.delete(user.getCustomerProfile());
        if (user.getEmployeeProfile() != null) employeeProfileRepository.delete(user.getEmployeeProfile());

        // 8. Cuối cùng xoá user
        userRepository.delete(user);
        return "Delete success";
    }
    public User handleGetUserByUsername(String email){
        return this.userRepository.findByEmail(email);
    }

    @Override
    public User handleGetUserByPhone(String phone) {
        return this.userRepository.findByPhone(phone);
    }


    public void updateUserToken(String token, String email){
        User currentUser = this.handleGetUserByUsername(email);
        if(userRepository != null){
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    public User getUserByRefreshTokenAndEmail(String token, String email){
        return this.userRepository.findByRefreshTokenAndEmail(token,email);
    }

    @Override
    public ResultPaginationDTO getAllUserByRole(Specification<User> spec, Pageable pageable) {
        Specification<User> finalSpec = spec == null
                ? (root, query, cb) -> cb.equal(root.get("userRole"), Role.CUSTOMER)
                : spec.and((root, query, cb) -> cb.equal(root.get("userRole"),  Role.CUSTOMER));
        Page<User> page = userRepository.findAll(finalSpec, pageable);
        List<ResUserDTO> userDTOs = page.getContent()
                .stream()
                .map(mapper::toResUserDTO)
                .toList();
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(page.getContent());

        rs.setResult(userDTOs);
        return rs;
    }

    public ResultPaginationDTO getAllUserByEmployee(Specification<User> spec, Pageable pageable) {
        Specification<User> finalSpec = spec == null
                ? (root, query, cb) -> cb.or(
                cb.equal(root.get("userRole"), Role.EMPLOYEE),
                cb.equal(root.get("userRole"), Role.ADMIN)
        )
                : spec.and((root, query, cb) -> cb.or(
                cb.equal(root.get("userRole"), Role.EMPLOYEE),
                cb.equal(root.get("userRole"), Role.ADMIN)
        ));

        Page<User> page = userRepository.findAll(finalSpec, pageable);

        List<ResUserDTO> userDTOs = page.getContent()
                .stream()
                .map(mapper::toResUserDTO)
                .toList();

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(userDTOs); // chỉ cần set DTO, không cần set entity gốc

        return rs;
    }



}
