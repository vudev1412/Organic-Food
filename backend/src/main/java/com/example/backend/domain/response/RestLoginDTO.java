package com.example.backend.domain.response;

import com.example.backend.enums.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
public class RestLoginDTO {
    @JsonProperty("access_token")
    private String accessToken;
    private UserLogin userLogin;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserLogin{
        private long id;
        private String email;
        private String name;
        private String role;
        private String phone;
        private String avatar;
        public UserLogin(long id, String email, String name, String role) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.role = role;
        }
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserGetAccount{
        private UserLogin user;
    }
}