package com.example.backend.controller;

import com.example.backend.domain.Payment;
import com.example.backend.repository.PaymentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.example.backend.enums.StatusPayment;
import java.time.Instant;
@RestController
@RequestMapping("/api/v1/payments")
public class WebhookController {

    private final PayOS payOS;
    private final PaymentRepository paymentRepository;
    public WebhookController(PayOS payOS,PaymentRepository paymentRepository) {
        this.payOS = payOS;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody ObjectNode webhookBody) {
        try {
            // 1. Log ngay lập tức để debug
            System.out.println("-----> WEBHOOK ĐÃ VÀO ĐƯỢC CONTROLLER! <-----");

            // 2. Xác thực dữ liệu
            var data = payOS.webhooks().verify(webhookBody);

            // 3. Lấy ID và tìm trong DB
            long paymentId = data.getOrderCode();
            System.out.println("Đang xử lý đơn hàng ID: " + paymentId);

            Payment payment = paymentRepository.findById(paymentId).orElse(null);

            if (payment != null) {
                // Chỉ update nếu đơn đang PENDING hoặc FAILED
                if (payment.getStatus() == StatusPayment.PENDING || payment.getStatus() == StatusPayment.FAILED) {
                    payment.setStatus(StatusPayment.SUCCESS);
                    payment.setCreateAt(Instant.now());
                    paymentRepository.save(payment);
                    System.out.println("✅ Đã cập nhật Database thành công!");
                }
            } else {
                System.out.println("❌ Không tìm thấy đơn hàng trong DB");
            }

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            e.printStackTrace();
            // In lỗi ra để biết tại sao verify thất bại (thường do sai Checksum Key)
            System.err.println("❌ Lỗi xử lý Webhook: " + e.getMessage());
            return ResponseEntity.ok("OK"); // Vẫn trả OK để PayOS không gửi lại
        }
    }
}