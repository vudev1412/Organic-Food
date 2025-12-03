package com.example.backend.controller;

import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.Invoice;
import com.example.backend.domain.Payment;
import com.example.backend.domain.User;
import com.example.backend.domain.request.CreatePaymentDTO;
import com.example.backend.domain.request.ReqPaymentDTO;
import com.example.backend.domain.request.CreateMembershipDTO;
import com.example.backend.domain.response.PaymentDTO;
import com.example.backend.domain.response.ResPaymentDTO;
import com.example.backend.enums.StatusPayment;
import com.example.backend.repository.CustomerProfileRepository;
import com.example.backend.repository.InvoiceRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.PaymentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final PayOS payOS;
    @PostMapping("/payments/create-membership")
    public ResponseEntity<Object> createMembershipPayment(@RequestBody CreateMembershipDTO body) {
        Payment savedPayment = null;
        User user = null;
        CustomerProfile profile = null;

        try {
            // BƯỚC 1: Tìm User và Profile
            user = userRepository.findById(body.getUserId())
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            profile = user.getCustomerProfile();
            if (profile == null) {
                profile = new CustomerProfile();
                profile.setUser(user);
            }

            // KIỂM TRA LỖI LOGIC: Trả về JSON chuẩn (Sửa Lỗi 1)
            if (profile.isMember()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Bạn đã là thành viên VIP rồi!");
                errorResponse.put("error", "VIP_ALREADY_MEMBER");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // BƯỚC 2: Tạo Payment (PENDING)
            Payment payment = new Payment();
            payment.setAmount(body.getAmount());
            payment.setCreateAt(Instant.now());
            payment.setMethod("BANK_TRANSFER");
            payment.setProvider("PayOS");
            payment.setStatus(StatusPayment.PENDING);

            savedPayment = paymentRepository.save(payment);

            // BƯỚC QUAN TRỌNG: LINK PAYMENT VÀO PROFILE NGAY LẬP TỨC
            profile.setMembershipPayment(savedPayment);
            customerProfileRepository.save(profile);

            // BƯỚC 3: Gọi PayOS tạo link
            long paymentId = savedPayment.getId();
            String description = "Nang cap VIP " + body.getUserId();

            CreatePaymentLinkRequest request = CreatePaymentLinkRequest.builder()
                    .orderCode(paymentId)
                    .amount((long) body.getAmount())
                    .description(description)
                    .buyerName(user.getName())
                    .cancelUrl("http://localhost:5137/membership/payment-failed")
                    .returnUrl("http://localhost:5137/membership/payment-success")
                    .build();

            CreatePaymentLinkResponse response = payOS.paymentRequests().create(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();

            // XỬ LÝ ROLLBACK VÀ TRẢ VỀ LỖI (Sửa Lỗi 2 & 3)
            if (savedPayment != null && user != null && profile != null) {
                // 1. Rollback Payment Status
                savedPayment.setStatus(StatusPayment.FAILED);
                paymentRepository.save(savedPayment);

                // 2. Rollback CustomerProfile (Gỡ liên kết)
                profile.setMembershipPayment(null);
                customerProfileRepository.save(profile);
            }

            Map<String, String> errorResponse = new HashMap<>();
            // Trả về message phù hợp với FE
            errorResponse.put("message", "Lỗi hệ thống hoặc lỗi cổng thanh toán. Vui lòng thử lại.");
            errorResponse.put("details", e.getMessage());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    @PostMapping("/payments/create")
    public ResponseEntity<Object> createPayment(@RequestBody CreatePaymentDTO body) {
        // 1. Khai báo biến ở ngoài để khối catch có thể nhìn thấy
        Payment savedPayment = null;

        try {
            // BƯỚC 1: Tạo Payment Entity
            Payment payment = new Payment();
            payment.setAmount(body.getAmount());
            payment.setCreateAt(Instant.now());
            payment.setMethod("BANK_TRANSFER");
            payment.setProvider("PayOS");
            payment.setStatus(StatusPayment.PENDING);

            savedPayment = paymentRepository.save(payment);
            long orderIdTarget = body.getOrderId();
            Optional<Invoice> invoiceOptional = invoiceRepository.findByOrderId(orderIdTarget);
            if (invoiceOptional.isPresent()) {
                Invoice invoice = invoiceOptional.get();
                invoice.setPayment(savedPayment); // Cập nhật Payment ID vào Invoice
                invoiceRepository.save(invoice);  // LƯU LẠI NGAY
                System.out.println("✅ Đã link Payment ID " + savedPayment.getId() + " vào Invoice của Order " + orderIdTarget);
            } else {
                System.err.println("❌ CẢNH BÁO: Không tìm thấy Invoice cho Order ID " + orderIdTarget);
            }
            // BƯỚC 2: Lấy ID để gọi PayOS
            long paymentId = savedPayment.getId();

            // Xử lý thông tin người mua
            String tenNguoiMua = body.getBuyerName();
            String sdtNguoiMua = body.getBuyerPhone();
            if (tenNguoiMua == null || tenNguoiMua.isEmpty()) tenNguoiMua = "Khách vãng lai";
            if (sdtNguoiMua == null || sdtNguoiMua.isEmpty()) sdtNguoiMua = "";

            long orderIdHienThi = body.getOrderId();
            String description = body.getDescription();

            CreatePaymentLinkRequest request = CreatePaymentLinkRequest.builder()
                    .orderCode(paymentId) // Dùng ID của bảng Payment
                    .amount((long) body.getAmount())
                    .description(description)
                    .buyerName(tenNguoiMua)
                    .buyerPhone(sdtNguoiMua)
                    .returnUrl("http://localhost:3000/success")
                    .cancelUrl("http://localhost:3000/cancel")
                    .build();

            CreatePaymentLinkResponse response = payOS.paymentRequests().create(request);

            // BƯỚC 3: Trả về kết quả thành công
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();

            // --- ĐOẠN CODE CẬP NHẬT TRẠNG THÁI FAILED ---
            try {
                // Kiểm tra: Nếu đã lưu được vào DB rồi mà mới bị lỗi (ví dụ lỗi mạng gọi PayOS)
                if (savedPayment != null) {
                    savedPayment.setStatus(StatusPayment.FAILED);
                    paymentRepository.save(savedPayment);
                    System.out.println("Đã cập nhật trạng thái thanh toán thành FAILED cho ID: " + savedPayment.getId());
                }
            } catch (Exception ex) {
                // Lỗi chồng lỗi (ít khi xảy ra nhưng nên catch để không mất log lỗi chính)
                System.err.println("Lỗi không thể cập nhật trạng thái FAILED: " + ex.getMessage());
            }
            // --------------------------------------------

            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }
    // API để Frontend hỏi thăm trạng thái (Polling)
    @GetMapping("/payments/status/{paymentId}")
    public ResponseEntity<Map<String, String>> getPaymentStatus(@PathVariable long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);

        if (payment == null) {
            return ResponseEntity.notFound().build();
        }

        // Trả về JSON: { "status": "SUCCESS" }
        return ResponseEntity.ok(Map.of("status", payment.getStatus().name()));
    }
    @PostMapping("/payments")
    public ResponseEntity<ResPaymentDTO> createPayment(@RequestBody ReqPaymentDTO req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.createPayment(req));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/payments/{id}")
    public ResponseEntity<ResPaymentDTO> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @PatchMapping("/payments/{id}")
    public ResponseEntity<ResPaymentDTO> updatePayment(@PathVariable Long id, @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.updatePayment(id, payment));
    }

    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
