package com.example.backend.controller;

import com.example.backend.domain.Payment;
import com.example.backend.domain.request.CreatePaymentDTO;
import com.example.backend.domain.request.ReqPaymentDTO;
import com.example.backend.domain.response.ResPaymentDTO;
import com.example.backend.enums.StatusPayment;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.Instant;
import java.util.List;
import java.util.Map;

import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final PayOS payOS;
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

            // Lưu xuống DB (Lúc này savedPayment sẽ có giá trị và có ID)
            savedPayment = paymentRepository.save(payment);

            // BƯỚC 2: Lấy ID để gọi PayOS
            long paymentId = savedPayment.getId();

            // Xử lý thông tin người mua
            String tenNguoiMua = body.getBuyerName();
            String sdtNguoiMua = body.getBuyerPhone();
            if (tenNguoiMua == null || tenNguoiMua.isEmpty()) tenNguoiMua = "Khách vãng lai";
            if (sdtNguoiMua == null || sdtNguoiMua.isEmpty()) sdtNguoiMua = "";

            long orderIdHienThi = body.getOrderId();
            String description = "TT Don " + orderIdHienThi;

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
    public ResponseEntity<List<ResPaymentDTO>> getAllPayments() {
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
