package com.example.backend.config;

import com.example.backend.domain.User;
import com.example.backend.service.UserService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.*;

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
            user = userService.handleGetUserByUsername(username);
        } else {
            user = userService.handleGetUserByPhone(username);
        }

        if (user == null) {
            throw new UsernameNotFoundException("Username/password không hợp lệ");
        }

        Set<SimpleGrantedAuthority> authorities = new HashSet<>();

        // ROLE_*
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));

        // PERMISSION từ bảng
        user.getRole().getPermissions().forEach(p ->
                authorities.add(new SimpleGrantedAuthority(p.getName()))
        );

        return new org.springframework.security.core.userdetails.User(
                username,
                user.getPassword(),
                authorities
        );
    }


}
