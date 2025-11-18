package com.example.backend.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ReqUpdateEmployeeProfile {
    private String employeeCode;

    private String address;

    private Instant hireDate;

    private double salary;

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
