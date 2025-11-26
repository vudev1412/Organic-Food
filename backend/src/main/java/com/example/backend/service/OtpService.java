// Interface OtpService.java
package com.example.backend.service;

import com.example.backend.util.error.IdInvalidException;
import jakarta.mail.MessagingException;

public interface OtpService {
    void sendOtpEmail(String email) throws MessagingException, IdInvalidException;
    void validateOtp(String email, String otp) throws IdInvalidException;
}