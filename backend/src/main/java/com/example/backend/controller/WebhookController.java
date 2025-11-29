package com.example.backend.controller;

import com.example.backend.domain.Invoice; // Import Invoice
import com.example.backend.domain.Payment;
import com.example.backend.enums.StatusInvoice; // Import Enum Invoice
import com.example.backend.enums.StatusPayment;
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

    public WebhookController(PayOS payOS, PaymentRepository paymentRepository, InvoiceRepository invoiceRepository) {
        this.payOS = payOS;
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody ObjectNode webhookBody) {
        try {
            // 1. Verify dữ liệu từ PayOS
            var data = payOS.webhooks().verify(webhookBody);

            // 2. Lấy Payment ID (orderCode) từ webhook
            long paymentId = data.getOrderCode();

            // 3. Tìm Payment trong DB
            Payment payment = paymentRepository.findById(paymentId).orElse(null);

            if (payment != null) {
                // Chỉ xử lý nếu trạng thái chưa thành công
                if (payment.getStatus() == StatusPayment.PENDING || payment.getStatus() == StatusPayment.FAILED) {

                    // A. Cập nhật Payment thành SUCCESS
                    payment.setStatus(StatusPayment.SUCCESS);
                    payment.setCreateAt(Instant.now());
                    paymentRepository.save(payment);

                    // ========================================================================
                    // [QUAN TRỌNG] TÌM INVOICE VÀ UPDATE THÀNH PAID
                    // ========================================================================
                    // Tìm Invoice đang gắn với Payment ID này
                    Optional<Invoice> invoiceOptional = invoiceRepository.findByPaymentId(paymentId);

                    if (invoiceOptional.isPresent()) {
                        Invoice invoice = invoiceOptional.get();

                        // Cập nhật trạng thái hóa đơn
                        invoice.setStatus(StatusInvoice.PAID);

                        // (Tuỳ chọn) Cập nhật luôn trạng thái đơn hàng nếu muốn
                        // invoice.getOrder().setStatusOrder(StatusOrder.CONFIRMED);

                        invoiceRepository.save(invoice);
                        System.out.println("✅ Webhook: Đã update Invoice ID " + invoice.getId() + " thành PAID");
                    } else {
                        System.err.println("❌ Webhook: Không tìm thấy Invoice nào có Payment ID " + paymentId);
                    }
                    // ========================================================================
                }
            }
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("OK");
        }
    }
}