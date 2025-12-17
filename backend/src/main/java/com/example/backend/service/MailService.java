package com.example.backend.service;

import com.example.backend.domain.Voucher;

import java.io.File;
import java.util.Map;

public interface MailService {

    /**
     * Gửi email đơn giản (text thuần)
     */
    void sendSimpleMail(String to, String subject, String content);

    /**
     * Gửi email HTML
     */
    void sendHtmlMail(String to, String subject, String htmlContent);

    /**
     * Gửi email HTML có đính kèm file
     */
    void sendHtmlMailWithAttachment(String to, String subject, String htmlContent, File attachment);

    /**
     * Gửi email từ template (sử dụng Thymeleaf hoặc string format)
     */
    void sendTemplatedMail(String to, String subject, String templateName, Map<String, Object> variables);

    /**
     * Gửi email chào mừng khi tạo tài khoản
     */
    void sendWelcomeEmail(String to, String name, String email, String password, String role, boolean isDefaultPassword);

    /**
     * Gửi email xác thực tài khoản
     */
    void sendVerificationEmail(String to, String name, String verificationLink);

    /**
     * Gửi email đặt lại mật khẩu
     */
    void sendResetPasswordEmail(String to, String name, String resetLink);

    void sendOrderDeliveredEmail(String toEmail, String customerName, Long orderId);
    public void sendVoucherEmail(String to, Voucher voucher);
}