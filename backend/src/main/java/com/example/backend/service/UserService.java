package com.example.backend.service;

import com.example.backend.domain.User;
import com.example.backend.domain.response.ResCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface UserService {
    boolean isEmailExist(String email);
    User handleCreateUser(User user);

    ResultPaginationDTO handleGetAllUser(Specification<User> spec, Pageable pageable);

    Optional<User> handleGetUserById(Long id);

    User handleUpdateUser(Long id, User user);

    ResCreateUserDTO convertToResCreateUserDTO(User user);

    String handleDeleteUser(Long id);
    User handleGetUserByUsername(String email);

    User handleGetUserByPhone(String phone);
    void updateUserToken(String token, String email);

    User getUserByRefreshTokenAndEmail(String token, String email);
}
