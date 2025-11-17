package com.example.backend.controller;


import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqLoginDTO;
import com.example.backend.domain.response.RestLoginDTO;
import com.example.backend.service.UserService;
import com.example.backend.util.SecurityUtil;
import com.example.backend.util.annotation.ApiMessage;
import com.example.backend.util.error.IdInvalidException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    @Value("${lhv.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final UserService userService;
    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil, UserService userService){
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.userService = userService;
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
}
