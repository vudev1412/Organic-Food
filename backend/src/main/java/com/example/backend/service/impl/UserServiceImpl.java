package com.example.backend.service.impl;

import com.example.backend.domain.User;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    public UserServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    public boolean isEmailExist(String email){
        return this.userRepository.existsByEmail(email);
    }
    public User handleCreateUser(User user){

        return userRepository.save(user);
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

    public User handleUpdateUser(Long id, User user){
        Optional<User> myUser = this.handleGetUserById(id);
        if(myUser.isPresent()){
            User userCurr = myUser.get();
            userCurr.setName(user.getName());
            userCurr.setEmail(user.getEmail());
            userCurr.setPhone(user.getPhone());
            userCurr.setPassword(user.getPassword());
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
}
