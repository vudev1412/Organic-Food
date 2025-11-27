package com.example.backend.service.impl;

import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.Order;
import com.example.backend.domain.Return;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCreateUserDTO;
import com.example.backend.domain.request.ReqResetPasswordDTO;
import com.example.backend.domain.request.ReqUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResCreateUserDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.enums.Role;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.*;
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
    public boolean isEmailExist(String email){
        return this.userRepository.existsByEmail(email);
    }

    @Override
    public boolean isPhoneExist(String phone) {
        return this.userRepository.existsByPhone(phone);
    }

    @Override
    public ResUserDTO handleCreateUser(ReqCreateUserDTO userDTO) throws IdInvalidException {

        // 1. Tìm xem user đã có trong DB chưa (Thay vì chỉ check exists)
        User currentUser = userRepository.findByEmail(userDTO.getEmail());

        // 2. XỬ LÝ LOGIC EMAIL TỒN TẠI
        if (currentUser != null) {
            // Trường hợp 1: Tài khoản đã tồn tại VÀ Đã xác thực -> Báo lỗi
            if (currentUser.isEmailVerified()) {
                throw new IdInvalidException("Email này đã được sử dụng và kích hoạt.");
            }

            // Trường hợp 2: Tài khoản tồn tại nhưng CHƯA xác thực (User quay lại sửa form)
            // -> Ta sẽ tái sử dụng (Update) user này thay vì tạo mới hay báo lỗi.
            // (Code sẽ chạy tiếp xuống dưới để cập nhật thông tin mới)
        } else {
            // Trường hợp 3: Chưa có user nào -> Tạo mới hoàn toàn
            currentUser = new User();
            currentUser.setEmail(userDTO.getEmail());
        }

        // 3. KIỂM TRA SỐ ĐIỆN THOẠI (Logic chặt chẽ hơn)
        User phoneOwner = userRepository.findByPhone(userDTO.getPhone());
        if (phoneOwner != null) {
            // Nếu số điện thoại đã có trong DB, nhưng không phải của chính user đang update (ID khác nhau)
            // Thì mới báo lỗi.
            if (currentUser.getId() == null || !phoneOwner.getId().equals(currentUser.getId())) {
                throw new IdInvalidException("Số điện thoại này đã được sử dụng bởi người khác.");
            }
        }

        // 4. CẬP NHẬT THÔNG TIN (Cho cả User mới hoặc User cũ chưa verify)
        // Lưu ý: Không dùng mapper.toUser() ở đây vì nó sẽ tạo object mới, làm mất ID của user cũ
        currentUser.setName(userDTO.getName());
        currentUser.setPhone(userDTO.getPhone());

        // 5. MÃ HÓA MẬT KHẨU
        currentUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        // 6. THIẾT LẬP TRẠNG THÁI
        currentUser.setEmailVerified(false); // Reset lại trạng thái verify để bắt buộc nhập OTP mới

        // 7. Xử lý Role
        if (userDTO.getRole() != null) {
            currentUser.setUserRole(Role.valueOf(userDTO.getRole()));
        } else {
            // Nếu update mà chưa có role thì set, có rồi thì giữ nguyên hoặc set lại tùy logic
            if (currentUser.getUserRole() == null) {
                currentUser.setUserRole(Role.CUSTOMER);
            }
        }

        // 8. Lưu xuống DB
        // Nếu currentUser có ID (cũ) -> Hibernate sẽ UPDATE.
        // Nếu currentUser không có ID (mới) -> Hibernate sẽ INSERT.
        User saved = userRepository.save(currentUser);

        // 9. Trả về DTO
        return mapper.toResUserDTO(saved);
    }


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
        Specification<User> finalSpec = spec == null
                ? (root, query, cb) -> cb.equal(root.get("userRole"), Role.CUSTOMER)
                : spec.and((root, query, cb) -> cb.equal(root.get("userRole"),  Role.CUSTOMER));
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
        rs.setResult(page.getContent());

        rs.setResult(userDTOs);
        return rs;
    }

    public ResultPaginationDTO getAllUserByEmployee(Specification<User> spec, Pageable pageable) {
        Specification<User> finalSpec = spec == null
                ? (root, query, cb) -> cb.or(
                cb.equal(root.get("userRole"), Role.EMPLOYEE),
                cb.equal(root.get("userRole"), Role.ADMIN)
        )
                : spec.and((root, query, cb) -> cb.or(
                cb.equal(root.get("userRole"), Role.EMPLOYEE),
                cb.equal(root.get("userRole"), Role.ADMIN)
        ));

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
        rs.setResult(userDTOs); // chỉ cần set DTO, không cần set entity gốc

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
