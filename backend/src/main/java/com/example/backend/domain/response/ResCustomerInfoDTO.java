package com.example.backend.domain.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor // Tự tạo constructor có đủ tham số
@NoArgsConstructor
public class ResCustomerInfoDTO {
    // Thông tin cơ bản
    private long id;
    private String name;
    private String email;
    private String phone;
    private String image;

    // Trạng thái thành viên (Chỉ cần true/false)
    private boolean isMember;
}