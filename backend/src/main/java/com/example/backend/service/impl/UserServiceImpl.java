package com.example.backend.service.impl;

import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCreateUserDTO;
import com.example.backend.domain.request.ReqUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.enums.Role;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;
    public boolean isEmailExist(String email){
        return this.userRepository.existsByEmail(email);
    }

    @Override
    public User handleCreateUser(ReqCreateUserDTO user) {
        User entity = mapper.toUser(user);

        // Nếu role là enum, đảm bảo convert
        if (entity.getUserRole() == null && user.getRole() != null) {
            entity.setUserRole(Role.valueOf(user.getRole()));
        }

        // Save entity
        User saved = userRepository.save(entity);

        // Nếu muốn trả về DTO
        // return userMapper.toResUserDTO(saved);
        return saved;
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

    public String handleDeleteUser(Long id){
        userRepository.deleteById(id);
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
                ? (root, query, cb) -> cb.equal(root.get("userRole"), Role.EMPLOYEE)
                : spec.and((root, query, cb) -> cb.equal(root.get("userRole"),  Role.EMPLOYEE));
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


}
