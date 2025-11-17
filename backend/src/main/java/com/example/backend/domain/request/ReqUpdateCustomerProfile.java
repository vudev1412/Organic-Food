package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateCustomerProfile {
    private Boolean member;

    private UserInfo user;

    @Getter
    @Setter
    public static class UserInfo {
        private String name;
        private String phone;
        private String image;
        private String email;
    }
}
