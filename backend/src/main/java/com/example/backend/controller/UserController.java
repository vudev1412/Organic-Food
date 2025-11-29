package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCreateUserDTO;
import com.example.backend.domain.request.ReqUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResCreateUserDTO;
import com.example.backend.service.UserService;
import com.example.backend.util.annotation.ApiMessage;
import com.example.backend.util.error.IdInvalidException;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    public UserController(UserService userService, PasswordEncoder passwordEncoder){
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    @ApiMessage("fetch all user")
    public ResponseEntity<ResultPaginationDTO> getAllUser(@Filter Specification<User> spec, Pageable pageable){
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.handleGetAllUser(spec, pageable));
    }
    @GetMapping("/users-customer")
    public ResponseEntity<ResultPaginationDTO> getAllCustomer(@Filter Specification<User> spec, Pageable pageable){
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.getAllUserByRole(spec, pageable));
    }
    @GetMapping("/users-employee")
    public ResponseEntity<ResultPaginationDTO> getAllEmployee(@Filter Specification<User> spec, Pageable pageable){
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.getAllUserByEmployee(spec, pageable));
    }
    @PostMapping("/users")
    @ApiMessage("Created a user")
    public ResponseEntity<ResUserDTO> createUser(@Valid @RequestBody ReqCreateUserDTO user) throws IdInvalidException {
        // Chỉ kiểm tra tồn tại, không xử lý password
        boolean isEmailExist = this.userService.isEmailExist(user.getEmail());
        boolean isPhoneExist = this.userService.isPhoneExist(user.getPhone());

        if (isEmailExist) {
            throw new IdInvalidException(
                    "Email " + user.getEmail() + " đã tồn tại, vui lòng sử dụng email khác"
            );
        }

        if (isPhoneExist) {
            throw new IdInvalidException(
                    user.getPhone() + " đã tồn tại, vui lòng sử dụng số điện thoại khác"
            );
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.userService.handleCreateUser(user));
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<Optional<User>> getUserById(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body( this.userService.handleGetUserById(id));
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody ReqUserDTO user){
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.handleUpdateUser(id,user));
    }


    @DeleteMapping("/users/{id}")
    @ApiMessage("Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) throws IdInvalidException{
        Optional<User> currentUser = this.userService.handleGetUserById(id);
        if(currentUser.isEmpty()){
            throw new IdInvalidException("User với id" + id + "không tồn tại");
        }
        this.userService.handleDeleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
