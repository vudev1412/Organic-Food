package com.example.backend.controller;

import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.Invoice; // Import Invoice
import com.example.backend.domain.Payment;
import com.example.backend.enums.StatusInvoice; // Import Enum Invoice
import com.example.backend.enums.StatusPayment;
import com.example.backend.repository.CustomerProfileRepository;
import com.example.backend.repository.InvoiceRepository; // Import Repo
import com.example.backend.repository.PaymentRepository;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/payments")
public class WebhookController {

    private final PayOS payOS;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository; // Inject thêm cái này
    private final CustomerProfileRepository customerProfileRepository; // Inject thêm cái này

    public WebhookController(PayOS payOS, PaymentRepository paymentRepository, InvoiceRepository invoiceRepository,CustomerProfileRepository customerProfileRepository) {
        this.payOS = payOS;
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.customerProfileRepository = customerProfileRepository;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody ObjectNode webhookBody) {
        try {
            // 1. Verify và lấy ID (Giữ nguyên)
            var data = payOS.webhooks().verify(webhookBody);
            long paymentId = data.getOrderCode();

            Payment payment = paymentRepository.findById(paymentId).orElse(null);

            if (payment != null && (payment.getStatus() == StatusPayment.PENDING || payment.getStatus() == StatusPayment.FAILED)) {

                // Cập nhật Payment thành công (Chung cho cả 2 trường hợp)
                payment.setStatus(StatusPayment.SUCCESS);
                payment.setCreateAt(Instant.now());
                paymentRepository.save(payment);

                // ============================================================
                // BƯỚC QUAN TRỌNG: PHÂN LUỒNG XỬ LÝ
                // ============================================================

                // 1. KIỂM TRA LOGIC CŨ TRƯỚC (Ưu tiên Order)
                Optional<Invoice> invoiceOptional = invoiceRepository.findByPaymentId(paymentId);

                if (invoiceOptional.isPresent()) {
                    // --------------------------------------------------------
                    // ĐÂY LÀ CODE CŨ CỦA BẠN - GIỮ NGUYÊN KHÔNG ĐỔI
                    // --------------------------------------------------------
                    Invoice invoice = invoiceOptional.get();
                    invoice.setStatus(StatusInvoice.PAID);
                    invoiceRepository.save(invoice);
                    System.out.println("✅ (ORDER FLOW) Đã update Invoice ID " + invoice.getId());

                    // Kết thúc xử lý tại đây, không đi xuống dưới nữa
                    return ResponseEntity.ok("OK");
                }

                // 2. NẾU KHÔNG TÌM THẤY INVOICE -> MỚI CHECK MEMBERSHIP (Logic mới)
                // (Chỉ chạy vào đây nếu đây là thanh toán Membership)
                Optional<CustomerProfile> profileOptional = customerProfileRepository.findByMembershipPaymentId(paymentId);

                if (profileOptional.isPresent()) {
                    CustomerProfile profile = profileOptional.get();
                    profile.setMember(true);
                    customerProfileRepository.save(profile);
                    System.out.println("✅ (MEMBERSHIP FLOW) Đã kích hoạt VIP cho User.");
                } else {
                    System.err.println("⚠️ Cảnh báo: Payment ID " + paymentId + " không thuộc về Order hay Membership nào.");
                }
            }
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("OK");
        }
    }
}