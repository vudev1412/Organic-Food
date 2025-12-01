package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.request.ReqCreateUserDTO;
import com.example.backend.domain.request.ReqResetPasswordDTO;
import com.example.backend.domain.request.ReqUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.*;
import com.example.backend.service.MailService;
import com.example.backend.service.UserService;
import com.example.backend.util.error.IdInvalidException;
import com.example.backend.util.error.InvalidOtpException;
import com.example.backend.util.error.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final ReturnRepository returnRepository;
    private final ReviewRepository reviewRepository;
    private final ReceiptRepository receiptRepository;
    private final InvoiceRepository invoiceRepository;
    private final ReturnItemRepository returnItemRepository;
    private final ReturnImageRepository returnImageRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CustomerAddressRepository customerAddressRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final RoleRepository roleRepository;
    public boolean isEmailExist(String email){
        return this.userRepository.existsByEmail(email);
    }

    @Override
    public boolean isPhoneExist(String phone) {
        return this.userRepository.existsByPhone(phone);
    }

    @Override
    public ResUserDTO handleCreateUser(ReqCreateUserDTO userDTO) throws IdInvalidException {

        // 1. Kiểm tra user theo email
        User currentUser = userRepository.findByEmail(userDTO.getEmail());

        if (currentUser != null) {
            if (currentUser.isEmailVerified()) {
                throw new IdInvalidException("Email này đã được sử dụng và kích hoạt.");
            }
        } else {
            currentUser = new User();
            currentUser.setEmail(userDTO.getEmail());
        }

        // 2. Kiểm tra số điện thoại
        User phoneOwner = userRepository.findByPhone(userDTO.getPhone());
        if (phoneOwner != null) {
            if (currentUser.getId() == null || !phoneOwner.getId().equals(currentUser.getId())) {
                throw new IdInvalidException("Số điện thoại này đã được sử dụng bởi người khác.");
            }
        }

        // 3. Cập nhật thông tin
        currentUser.setName(userDTO.getName());
        currentUser.setPhone(userDTO.getPhone());

        // 4. Xử lý password
        String rawPassword;
        boolean isDefaultPassword = false;

        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            rawPassword = "123456";
            isDefaultPassword = true;
        } else {
            rawPassword = userDTO.getPassword();
        }

        currentUser.setPassword(passwordEncoder.encode(rawPassword));

        // 5. Reset verify
        currentUser.setEmailVerified(false);

        // 6. Xử lý ROLE (ROLE ENTITY)
        // 6. Xử lý ROLE
        Role roleEntity;
        if (userDTO.getRoleName() != null && !userDTO.getRoleName().isEmpty()) {
            roleEntity = roleRepository.findByName(userDTO.getRoleName())
                    .orElseThrow(() -> new IdInvalidException("Role không tồn tại"));
        } else {
            roleEntity = roleRepository.findByName("CUSTOMER")
                    .orElseThrow(() -> new IdInvalidException("Role CUSTOMER không tồn tại"));
        }

        currentUser.setRole(roleEntity);


        // 7. Lưu DB
        User saved = userRepository.save(currentUser);







        sendWelcomeEmail(saved, rawPassword, isDefaultPassword);
        return mapper.toResUserDTO(saved);
    }

    private void sendWelcomeEmail(User user, String password, boolean isDefaultPassword) {
        String subject = "Chào mừng đến với hệ thống - Thông tin tài khoản";

        StringBuilder emailContent = new StringBuilder();
        emailContent.append("Kính gửi ").append(user.getName()).append(",\n\n");
        emailContent.append("Tài khoản của bạn đã được tạo thành công bởi quản trị viên.\n\n");
        emailContent.append("═══════════════════════════════════\n");
        emailContent.append("THÔNG TIN TÀI KHOẢN\n");
        emailContent.append("═══════════════════════════════════\n");
        emailContent.append("📧 Email: ").append(user.getEmail()).append("\n");
        emailContent.append("🔑 Mật khẩu: ").append(password).append("\n");
        emailContent.append("👤 Họ tên: ").append(user.getName()).append("\n");
        emailContent.append("📱 Số điện thoại: ").append(user.getPhone()).append("\n");
        emailContent.append("═══════════════════════════════════\n\n");

        if (isDefaultPassword) {
            emailContent.append("⚠️ LƯU Ý QUAN TRỌNG:\n");
            emailContent.append("- Đây là mật khẩu mặc định của hệ thống\n");
            emailContent.append("- Vui lòng đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản\n\n");
        } else {
            emailContent.append("🔐 LƯU Ý BẢO MẬT:\n");
            emailContent.append("- Không chia sẻ mật khẩu với bất kỳ ai\n");
            emailContent.append("- Nên đổi mật khẩu định kỳ để đảm bảo an toàn\n\n");
        }

        emailContent.append("🌐 Link đăng nhập: http://localhost:5173/login\n\n");
        emailContent.append("Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận hỗ trợ.\n\n");
        emailContent.append("Trân trọng,\n");
        emailContent.append("Ban quản trị hệ thống");

        mailService.sendSimpleMail(user.getEmail(), subject, emailContent.toString());
    }

    /**
     * Lấy tên hiển thị của vai trò
     */




    public ResultPaginationDTO handleGetAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(spec,pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageUser.getContent());

        List<ResUserDTO> listUser = pageUser.getContent()
                .stream().map(item -> new ResUserDTO(
                        item.getId(),
                        item.getName(),
                        item.getEmail(),
                        item.getPhone()
                )).collect(Collectors.toList());

        rs.setResult(listUser);
        return rs;
    }

    public Optional<User> handleGetUserById(Long id){
        return userRepository.findById(id);
    }

    public User handleUpdateUser(Long id, ReqUserDTO user) {
        Optional<User> myUser = this.handleGetUserById(id);
        if(myUser.isPresent()){
            User userCurr = myUser.get();

            if(user.getName() != null){
                userCurr.setName(user.getName());
            }
            if(user.getPhone() != null){
                userCurr.setPhone(user.getPhone());
            }
            if(user.getPassword() != null){

                userCurr.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            if(user.getImage() != null){
                userCurr.setImage(user.getImage());
            }

            return this.userRepository.save(userCurr);
        }
        return null;
    }


    public ResCreateUserDTO convertToResCreateUserDTO(User user){
        ResCreateUserDTO resCreateUserDTO = new ResCreateUserDTO();
        resCreateUserDTO.setName(user.getName());
        resCreateUserDTO.setEmail(user.getEmail());
        resCreateUserDTO.setPhone(user.getPhone());
        return resCreateUserDTO;
    }

    @Transactional
    public String handleDeleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Xóa reviews
        reviewRepository.deleteAllByUser(user);

        // 2. Xóa receipts
        receiptRepository.deleteAllByUser(user);

        // 3. Xóa invoice customer + employee
        invoiceRepository.clearCustomerReference(user.getId());
        invoiceRepository.clearEmployeeReference(user.getId());

        // 4. Xóa orders và tất cả return liên quan
        for (Order order : user.getOrders()) {
            // Xóa return trước
            for (Return r : order.getReturns()) {
                returnItemRepository.deleteAllByReturns(r);
                returnImageRepository.deleteAllByReturns(r);
            }
            returnRepository.deleteAllByOrder(order);

            // Xóa orderDetails
            orderDetailRepository.deleteAllByOrder(order);

            // Xóa invoice
            invoiceRepository.deleteByOrder(order);

            // Xóa order
            orderRepository.delete(order);
        }

        // 5. Xóa cart
        if (user.getCart() != null) cartRepository.delete(user.getCart());

        // 6. Xóa address
        customerAddressRepository.deleteAllByUser(user);

        // 7. Xóa customerProfile / employeeProfile
        if (user.getCustomerProfile() != null) customerProfileRepository.delete(user.getCustomerProfile());
        if (user.getEmployeeProfile() != null) employeeProfileRepository.delete(user.getEmployeeProfile());

        // 8. Cuối cùng xoá user
        userRepository.delete(user);
        return "Delete success";
    }
    public User handleGetUserByUsername(String email){
        return this.userRepository.findByEmail(email);
    }

    @Override
    public User handleGetUserByPhone(String phone) {
        return this.userRepository.findByPhone(phone);
    }


    public void updateUserToken(String token, String email){
        User currentUser = this.handleGetUserByUsername(email);
        if(userRepository != null){
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    public User getUserByRefreshTokenAndEmail(String token, String email){
        return this.userRepository.findByRefreshTokenAndEmail(token,email);
    }

    @Override
    public ResultPaginationDTO getAllUserByRole(Specification<User> spec, Pageable pageable) {
        Specification<User> roleSpec = (root, query, cb) ->
                cb.equal(root.join("userRole").get("name"), "CUSTOMER");

        Specification<User> finalSpec = (spec == null)
                ? roleSpec
                : spec.and(roleSpec);

        Page<User> page = userRepository.findAll(finalSpec, pageable);

        List<ResUserDTO> userDTOs = page.getContent()
                .stream()
                .map(mapper::toResUserDTO)
                .toList();

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(userDTOs);

        return rs;
    }


    public ResultPaginationDTO getAllUserByEmployee(Specification<User> spec, Pageable pageable) {

        Specification<User> roleSpec = (root, query, cb) ->
                cb.or(
                        cb.equal(root.join("userRole").get("name"), "EMPLOYEE"),
                        cb.equal(root.join("userRole").get("name"), "ADMIN")
                );

        Specification<User> finalSpec = (spec == null)
                ? roleSpec
                : spec.and(roleSpec);

        Page<User> page = userRepository.findAll(finalSpec, pageable);

        List<ResUserDTO> userDTOs = page.getContent()
                .stream()
                .map(mapper::toResUserDTO)
                .toList();

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(userDTOs);

        return rs;
    }


    @Override
    @Transactional //  Thêm cái này để đảm bảo DB và Email đồng bộ
    public void handleResetPassword(ReqResetPasswordDTO request) throws UserNotFoundException, InvalidOtpException {
        // 1. Kiểm tra Email
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new UserNotFoundException("Email không tồn tại trong hệ thống.");
        }

        // 2. Kiểm tra OTP (SỬA Ở ĐÂY)
        // Dùng passwordEncoder.matches(rawPassword, encodedPassword)
        if (user.getEmailOtp() == null ||
                !passwordEncoder.matches(request.getOtp(), user.getEmailOtp())) {
            throw new InvalidOtpException("Mã OTP không chính xác.");
        }

        // 3. Kiểm tra thời hạn
        if (user.getEmailOtpExpiry() != null && Instant.now().isAfter(user.getEmailOtpExpiry())) {
            throw new InvalidOtpException("Mã OTP đã hết hạn.");
        }

        // 4. Update Password & Clear OTP
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setEmailOtp(null);
        user.setEmailOtpExpiry(null);
        userRepository.save(user);
    }
}
