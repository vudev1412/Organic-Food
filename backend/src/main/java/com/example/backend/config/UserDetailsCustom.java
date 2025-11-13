package com.example.backend.config;

import com.example.backend.domain.User;
import com.example.backend.service.UserService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component("userDetailsService")
public class UserDetailsCustom implements UserDetailsService {

    private final UserService userService;

    public UserDetailsCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user;

        if (username.contains("@")) {
            // login bằng email
            user = this.userService.handleGetUserByUsername(username);
        } else {
            // login bằng số điện thoại
            user = this.userService.handleGetUserByPhone(username);
        }

        if (user == null) {
            throw new UsernameNotFoundException("Username/password không hợp lệ");
        }

        // quyền động dựa theo role của user
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name());

        // giữ nguyên username người dùng nhập (email hoặc phone)
        return new org.springframework.security.core.userdetails.User(
                username,
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
