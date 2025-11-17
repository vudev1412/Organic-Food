//package com.example.backend.config;
//
//
//import com.example.backend.domain.User;
//import com.example.backend.enums.Role;
//import com.example.backend.repository.UserRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder){
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        if(userRepository.count() ==0){
//            User admin = new User();
//            admin.setName("Lê Hiền Vũ");
//            admin.setEmail("lehienvu5527@gmail.com");
//            admin.setPassword(passwordEncoder.encode("123456"));
//            admin.setPhone("0373399534");
//            admin.setUserRole(Role.ADMIN);
//            userRepository.save(admin);
//        }
//    }
//}
