// Class implement: OtpServiceImpl.java
package com.example.backend.service.impl;

import com.example.backend.domain.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.OtpService;
import com.example.backend.util.error.IdInvalidException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    private static final int OTP_LENGTH = 6;
    private static final long OTP_EXPIRY_MINUTES = 5;

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    @Override
    public void sendOtpEmail(String email) throws MessagingException, IdInvalidException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IdInvalidException("Email không tồn tại");
        }

        String otp = generateOtp();
        String hashedOtp = passwordEncoder.encode(otp);

        user.setEmailOtp(hashedOtp);
        user.setEmailOtpExpiry(Instant.now().plusSeconds(OTP_EXPIRY_MINUTES * 60));
        user.setEmailVerified(false);
        userRepository.save(user);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        helper.setTo(email);
        helper.setSubject("Mã OTP xác thực email");
        helper.setText("Mã OTP của bạn là: <b>" + otp + "</b><br>Hết hạn sau " + OTP_EXPIRY_MINUTES + " phút.", true);
        mailSender.send(mimeMessage);
    }

    @Override
    public void validateOtp(String email, String otp) throws IdInvalidException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IdInvalidException("Email không tồn tại");
        }

        if (user.isEmailVerified()) {
            return;
        }

        if (user.getEmailOtpExpiry() == null || user.getEmailOtpExpiry().isBefore(Instant.now())) {
            throw new IdInvalidException("OTP hết hạn");
        }

        if (!passwordEncoder.matches(otp, user.getEmailOtp())) {
            throw new IdInvalidException("OTP không đúng");
        }

        user.setEmailVerified(true);
        user.setEmailOtp(null);
        user.setEmailOtpExpiry(null);
        userRepository.save(user);
    }
}