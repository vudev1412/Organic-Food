package com.example.backend.service;

import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCreateUserDTO;
import com.example.backend.domain.request.ReqResetPasswordDTO;
import com.example.backend.domain.request.ReqUserDTO;
import com.example.backend.domain.response.ResCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.enums.Role;
import com.example.backend.util.error.IdInvalidException;
import com.example.backend.util.error.InvalidOtpException;
import com.example.backend.util.error.UserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface UserService {
    boolean isEmailExist(String email);
    boolean isPhoneExist(String phone);
    ResUserDTO handleCreateUser(ReqCreateUserDTO user) throws IdInvalidException;

    ResultPaginationDTO handleGetAllUser(Specification<User> spec, Pageable pageable);

    Optional<User> handleGetUserById(Long id);

    User handleUpdateUser(Long id, ReqUserDTO user);

    ResCreateUserDTO convertToResCreateUserDTO(User user);

    String handleDeleteUser(Long id);
    User handleGetUserByUsername(String email);

    User handleGetUserByPhone(String phone);
    void updateUserToken(String token, String email);

    User getUserByRefreshTokenAndEmail(String token, String email);

    ResultPaginationDTO getAllUserByRole(Specification<User> spec, Pageable pageable);
    ResultPaginationDTO getAllUserByEmployee(Specification<User> spec, Pageable pageable);
    void handleResetPassword(ReqResetPasswordDTO request) throws UserNotFoundException, InvalidOtpException;

}
