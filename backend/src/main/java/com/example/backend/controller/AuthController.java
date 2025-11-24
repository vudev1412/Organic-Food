package com.example.backend.controller;


import com.example.backend.domain.User;
import com.example.backend.domain.request.*;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.domain.response.RestLoginDTO;
import com.example.backend.service.OtpService;
import com.example.backend.service.UserService;
import com.example.backend.util.SecurityUtil;
import com.example.backend.util.annotation.ApiMessage;
import com.example.backend.util.error.IdInvalidException;
import com.example.backend.util.error.InvalidOtpException;
import com.example.backend.util.error.UserNotFoundException;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    @Value("${lhv.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;
    private final OtpService otpService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final UserService userService;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil, UserService userService, OtpService otpService){
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.userService = userService;
        this.otpService = otpService;
    }
    @PostMapping("/auth/register")
    @ApiMessage("Đăng ký tài khoản thành công")
    public ResponseEntity<Void> register(@Valid @RequestBody ReqCreateUserDTO registerDTO) throws IdInvalidException, MessagingException {
        // 1. Gọi Service tạo user (đã bao gồm hash pass và set verified=false)
        ResUserDTO newUserDTO = this.userService.handleCreateUser(registerDTO);

        // 2. Gửi OTP dựa vào email trả về
        this.otpService.sendOtpEmail(newUserDTO.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PostMapping("/auth/login")
    @ApiMessage("Login success")
    public ResponseEntity<RestLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDTO) throws UsernameNotFoundException {
        // Nạp input gồm username/password vào security
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());

        // Xác thực người dùng
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // Set thông tin người dùng đăng nhập vào context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // LẤY THÔNG TIN USER - FIX: Lấy theo đúng loại input
        User userCurr;
        String usernameInput = loginDTO.getUsername();

        if (usernameInput.contains("@")) {
            userCurr = this.userService.handleGetUserByUsername(usernameInput);
        } else {
            userCurr = this.userService.handleGetUserByPhone(usernameInput);
        }

        if (userCurr == null) {
            throw new UsernameNotFoundException("Không tìm thấy thông tin người dùng");
        }

        // Tạo response
        RestLoginDTO res = new RestLoginDTO();
        RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin(
                userCurr.getId(),
                userCurr.getEmail(),
                userCurr.getName(),
                userCurr.getUserRole().name()
        );
        res.setUserLogin(userLogin);

        // Tạo access token - QUAN TRỌNG: Dùng EMAIL làm subject
        String accessToken = this.securityUtil.createAccessToken(userCurr.getEmail(), res.getUserLogin());
        res.setAccessToken(accessToken);

        // Tạo refresh token - QUAN TRỌNG: Dùng EMAIL
        String refresh_token = this.securityUtil.createRefreshToken(userCurr.getEmail(), res);

        // Update user - QUAN TRỌNG: Dùng EMAIL
        this.userService.updateUserToken(refresh_token, userCurr.getEmail());

        // Set cookie
        ResponseCookie responseCookie = ResponseCookie
                .from("refresh_token", refresh_token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(res);
    }

    @GetMapping("/auth/account")
    @ApiMessage("fetch account")
    public ResponseEntity<RestLoginDTO.UserGetAccount> getAccount(
            @RequestHeader(value = "delay", required = false, defaultValue = "0") long delay
    ) throws InterruptedException {

        if (delay > 0) {
            Thread.sleep(delay);
        }

        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User userCurr = this.userService.handleGetUserByUsername(email);

        RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin();
        RestLoginDTO.UserGetAccount userGetAccount = new RestLoginDTO.UserGetAccount();

        if (userCurr != null) {
            userLogin.setId(userCurr.getId());
            userLogin.setName(userCurr.getName());
            userLogin.setEmail(userCurr.getEmail());
            userLogin.setRole(userCurr.getUserRole().name());
            userGetAccount.setUser(userLogin);
        }

        return ResponseEntity.ok().body(userGetAccount);
    }


    @GetMapping("/auth/refresh")
    @ApiMessage("Get User by refresh token")
    public ResponseEntity<RestLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "abc") String refresh_token
    ) throws IdInvalidException {
        if(refresh_token.equals("abc")){
            throw new IdInvalidException("Bạn chưa có refresh token trên cookie");
        }
        //check valid
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refresh_token);
        String email = decodedToken.getSubject();

        //check user by email and refresh token
        User currentUser = this.userService.getUserByRefreshTokenAndEmail(refresh_token,email);
        if(currentUser == null){
            throw new IdInvalidException("Refresh Token không hợp lệ");
        }

        //issue new token/ set refresh token as cookies

        RestLoginDTO res = new RestLoginDTO();
        User userCurr = this.userService.handleGetUserByUsername(email);
        if(userCurr != null){
            RestLoginDTO.UserLogin userLogin = new RestLoginDTO.UserLogin(userCurr.getId(),userCurr.getEmail(),userCurr.getName(),userCurr.getUserRole().name());
            res.setUserLogin(userLogin);
        }
        String accessToken = this.securityUtil.createAccessToken(email,res.getUserLogin());
        res.setAccessToken(accessToken);

        //create a refresh token
        String new_refresh_token = this.securityUtil.createRefreshToken(email, res);

        //update user
        this.userService.updateUserToken(new_refresh_token, email);

        //set cookie
        ResponseCookie responseCookie = ResponseCookie
                .from("refresh_token", new_refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                .body(res);
    }

    @PostMapping("/auth/logout")
    @ApiMessage("Logout user")
    public ResponseEntity<Void> logout() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";

        if(email.equals("")){
            throw new IdInvalidException("Access token không hợp lệ");
        }
        this.userService.handleGetUserByUsername(email);
        //set cookie
        ResponseCookie deleSpringCookie = ResponseCookie
                .from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleSpringCookie.toString()).body(null);
    }
    @PostMapping("/auth/send-otp")
    @ApiMessage("Gửi OTP thành công")
    public ResponseEntity<Void> sendOtp(@RequestBody Map<String, String> request) throws IdInvalidException {
        String email = request.get("email");
        if (email == null || !email.contains("@")) {
            throw new IdInvalidException("Email không hợp lệ");
        }
        try {
            otpService.sendOtpEmail(email);
            return ResponseEntity.ok().build();
        } catch (MessagingException e) {
            throw new IdInvalidException("Lỗi gửi email: " + e.getMessage());  // Trả 400 thay vì 500
        }
    }
    // Endpoint verify OTP
    @PostMapping("/auth/verify-otp")
    @ApiMessage("Xác thực OTP thành công")
    public ResponseEntity<Void> verifyOtp(@RequestBody Map<String, String> request) throws IdInvalidException {
        String email = request.get("email");
        String otp = request.get("otp");
        otpService.validateOtp(email, otp);
        return ResponseEntity.ok().build();
    }
    // API 1: Gửi OTP
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<String> sendForgotPasswordOtp(@RequestBody @Valid ReqEmailDTO request) throws Exception {
        otpService.sendOtpEmail(request.getEmail());
        return ResponseEntity.ok("Mã OTP đã được gửi đến email.");
    }

    // ✅ API 2: Reset Password (Gộp luôn logic check OTP vào đây)
    @PostMapping("/auth/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ReqResetPasswordDTO request)
            throws UserNotFoundException, InvalidOtpException {

        userService.handleResetPassword(request);

        return ResponseEntity.ok("Đổi mật khẩu thành công.");
    }
}
