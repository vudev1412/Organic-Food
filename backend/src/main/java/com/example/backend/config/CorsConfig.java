package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // ✅ QUAN TRỌNG: Dùng setAllowedOriginPatterns thay vì setAllowedOrigins
        // Dấu "*" ở đây nghĩa là chấp nhận mọi nguồn (Ngrok, LAN, Localhost...)
        corsConfiguration.setAllowedOriginPatterns(Collections.singletonList("*"));

        // Các method cho phép
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Cho phép mọi header (bao gồm cả header riêng của Ngrok)
        corsConfiguration.setAllowedHeaders(Collections.singletonList("*"));

        // Cho phép gửi credentials (Cookie, Auth Header)
        corsConfiguration.setAllowCredentials(true);

        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }
}