package com.example.backend.service.impl;

import com.example.backend.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.name:Organic Food Store}")
    private String appName;

    @Value("${app.support.email}")
    private String supportEmail;

    @Value("${app.support.phone:}")
    private String supportPhone;

    @Override
    public void sendSimpleMail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);

            mailSender.send(message);
            log.info("✅ Email đơn giản đã được gửi đến: {}", to);
        } catch (Exception e) {
            log.error("❌ Lỗi khi gửi email đơn giản đến {}: {}", to, e.getMessage());
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }

    @Override
    public void sendHtmlMail(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("✅ Email HTML đã được gửi đến: {}", to);
        } catch (MessagingException e) {
            log.error("❌ Lỗi khi gửi email HTML đến {}: {}", to, e.getMessage());
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }

    @Override
    public void sendHtmlMailWithAttachment(String to, String subject, String htmlContent, File attachment) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            if (attachment != null && attachment.exists()) {
                helper.addAttachment(attachment.getName(), attachment);
            }

            mailSender.send(mimeMessage);
            log.info("✅ Email HTML có đính kèm đã được gửi đến: {}", to);
        } catch (MessagingException e) {
            log.error("❌ Lỗi khi gửi email có đính kèm đến {}: {}", to, e.getMessage());
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }

    @Override
    public void sendTemplatedMail(String to, String subject, String templateName, Map<String, Object> variables) {
        throw new UnsupportedOperationException("Chức năng này chưa được implement");
    }

    @Override
    public void sendWelcomeEmail(String to, String name, String email, String password, String role, boolean isDefaultPassword) {
        String subject = "🎉 Chào mừng đến với " + appName;
        String htmlContent = buildWelcomeEmailTemplate(name, email, password, role, isDefaultPassword);
        sendHtmlMail(to, subject, htmlContent);
    }

    @Override
    public void sendVerificationEmail(String to, String name, String verificationLink) {
        String subject = "✅ Xác thực tài khoản - " + appName;
        String htmlContent = buildVerificationEmailTemplate(name, verificationLink);
        sendHtmlMail(to, subject, htmlContent);
    }

    @Override
    public void sendResetPasswordEmail(String to, String name, String resetLink) {
        String subject = "🔑 Đặt lại mật khẩu - " + appName;
        String htmlContent = buildResetPasswordEmailTemplate(name, resetLink);
        sendHtmlMail(to, subject, htmlContent);
    }

    // ==================== PRIVATE HELPER METHODS ====================

    private String buildWelcomeEmailTemplate(String name, String email, String password, String role, boolean isDefaultPassword) {
        String roleDisplay = getRoleDisplayName(role);
        String warningSection = isDefaultPassword
                ? """
                <div class="warning">
                    <strong>⚠️ LƯU Ý QUAN TRỌNG:</strong><br>
                    - Đây là mật khẩu mặc định của hệ thống<br>
                    - Vui lòng đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản
                </div>
                """
                : """
                <div class="info-box" style="background-color: #DBEAFE;">
                    <strong>🔐 LƯU Ý BẢO MẬT:</strong><br>
                    - Không chia sẻ mật khẩu với bất kỳ ai<br>
                    - Nên đổi mật khẩu định kỳ để đảm bảo an toàn
                </div>
                """;

        // Xử lý số điện thoại hỗ trợ
        String supportInfo = supportPhone != null && !supportPhone.isEmpty()
                ? String.format("💬 Cần hỗ trợ? Liên hệ: <a href=\"mailto:%s\">%s</a> | ☎️ %s",
                supportEmail, supportEmail, supportPhone)
                : String.format("💬 Cần hỗ trợ? Liên hệ: <a href=\"mailto:%s\">%s</a>",
                supportEmail, supportEmail);

        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: white; padding: 40px 20px; text-align: center; }
                        .header h1 { font-size: 28px; margin-bottom: 10px; }
                        .content { padding: 40px 30px; }
                        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
                        .info-box { background-color: #ECFDF5; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 6px; }
                        .info-box h3 { color: #059669; margin-bottom: 15px; font-size: 18px; }
                        .info-row { padding: 10px 0; border-bottom: 1px solid #E5E7EB; }
                        .info-row:last-child { border-bottom: none; }
                        .label { font-weight: 600; color: #059669; display: inline-block; width: 140px; }
                        .value { color: #1F2937; }
                        .password { background: #FEE2E2; padding: 8px 16px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #DC2626; display: inline-block; }
                        .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 25px 0; border-radius: 6px; }
                        .warning strong { color: #D97706; }
                        .button-container { text-align: center; margin: 35px 0; }
                        .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: white !important; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: transform 0.2s; }
                        .button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); }
                        .divider { height: 1px; background: linear-gradient(to right, transparent, #E5E7EB, transparent); margin: 30px 0; }
                        .footer { background-color: #F9FAFB; padding: 25px; text-align: center; color: #6B7280; font-size: 13px; border-top: 1px solid #E5E7EB; }
                        .footer p { margin: 5px 0; }
                        .support { background-color: #ECFDF5; padding: 15px; border-radius: 6px; margin-top: 25px; text-align: center; }
                        .support a { color: #059669; text-decoration: none; font-weight: 600; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Chào mừng đến với %s</h1>
                            <p style="font-size: 16px; opacity: 0.95;">Tài khoản của bạn đã sẵn sàng!</p>
                        </div>
                        
                        <div class="content">
                            <p class="greeting">Kính gửi <strong>%s</strong>,</p>
                            <p style="margin-bottom: 25px;">Tài khoản của bạn đã được tạo thành công bởi quản trị viên. Dưới đây là thông tin đăng nhập của bạn:</p>
                            
                            <div class="info-box">
                                <h3>📋 Thông tin tài khoản</h3>
                                <div class="info-row">
                                    <span class="label">📧 Email:</span>
                                    <span class="value">%s</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">🔑 Mật khẩu:</span>
                                    <span class="password">%s</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">👤 Họ tên:</span>
                                    <span class="value">%s</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">🎭 Vai trò:</span>
                                    <span class="value">%s</span>
                                </div>
                            </div>
                            
                            %s
                            
                            <div class="button-container">
                                <a href="%s/login" class="button">🚀 Đăng nhập ngay</a>
                            </div>
                            
                            <div class="divider"></div>
                            
                            <div class="support">
                                <p>%s</p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p><strong>Trân trọng,</strong></p>
                            <p>Ban quản trị %s</p>
                            <p style="margin-top: 15px; font-size: 12px;">© 2024 %s. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                appName, name, email, password, name, roleDisplay,
                warningSection, frontendUrl, supportInfo, appName, appName
        );
    }

    private String buildVerificationEmailTemplate(String name, String verificationLink) {
        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: white; padding: 40px 20px; text-align: center; }
                        .content { padding: 40px 30px; }
                        .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: white !important; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 25px 0; }
                        .footer { background-color: #F9FAFB; padding: 25px; text-align: center; color: #6B7280; font-size: 13px; }
                        .warning { background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Xác thực tài khoản</h1>
                        </div>
                        <div class="content">
                            <p>Xin chào <strong>%s</strong>,</p>
                            <p>Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
                            <div style="text-align: center;">
                                <a href="%s" class="button">Xác thực email</a>
                            </div>
                            <div class="warning">
                                ⏰ Link này sẽ hết hạn sau 24 giờ.<br>
                                🔒 Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email.
                            </div>
                        </div>
                        <div class="footer">
                            <p>Trân trọng,<br>Ban quản trị %s</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                name, verificationLink, appName
        );
    }

    private String buildResetPasswordEmailTemplate(String name, String resetLink) {
        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #ef4444 0%%, #dc2626 100%%); color: white; padding: 40px 20px; text-align: center; }
                        .content { padding: 40px 30px; }
                        .button { display: inline-block; background: linear-gradient(135deg, #ef4444 0%%, #dc2626 100%%); color: white !important; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 25px 0; }
                        .footer { background-color: #F9FAFB; padding: 25px; text-align: center; color: #6B7280; font-size: 13px; }
                        .warning { background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔑 Đặt lại mật khẩu</h1>
                        </div>
                        <div class="content">
                            <p>Xin chào <strong>%s</strong>,</p>
                            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                            <div style="text-align: center;">
                                <a href="%s" class="button">Đặt lại mật khẩu</a>
                            </div>
                            <div class="warning">
                                ⏰ Link này sẽ hết hạn sau 1 giờ.<br>
                                🔒 Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                            </div>
                        </div>
                        <div class="footer">
                            <p>Trân trọng,<br>Ban quản trị %s</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                name, resetLink, appName
        );
    }

    private String getRoleDisplayName(String role) {
        return switch (role.toUpperCase()) {
            case "ADMIN" -> "Quản trị viên";
            case "EMPLOYEE" -> "Nhân viên";
            case "CUSTOMER" -> "Khách hàng";
            default -> role;
        };
    }
}