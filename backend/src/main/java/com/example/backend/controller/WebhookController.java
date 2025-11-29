package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

@RestController
@RequestMapping("/api/v1/payments")
public class WebhookController {

    private final PayOS payOS;

    public WebhookController(PayOS payOS) {
        this.payOS = payOS;
    }

    @PostMapping("/webhook")
    public String handleWebhook(@RequestBody Webhook webhookBody) {
        try {
            // Xác thực webhook
            WebhookData data = payOS.webhooks().verify(webhookBody);

            System.out.println("Thanh toán thành công đơn hàng: " + data.getOrderCode());
            System.out.println("Số tiền: " + data.getAmount());

            return "OK";
        } catch (Exception e) {
            e.printStackTrace();
            return "Webhook lỗi";
        }
    }
}