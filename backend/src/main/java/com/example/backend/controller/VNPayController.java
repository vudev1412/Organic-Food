package com.example.backend.controller;

import com.example.backend.domain.request.PaymentDTO;
import com.example.backend.domain.response.ResponseObject;
import com.example.backend.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class VNPayController {
    private final VNPayService paymentService;
    @GetMapping("/vn-pay")
    public ResponseObject<PaymentDTO.VNPayResponse> pay(HttpServletRequest request) {
        PaymentDTO.VNPayResponse response = paymentService.createVnPayPayment(request);

        return new ResponseObject<>(HttpStatus.OK, "Success", response);
    }

    @GetMapping("/vn-pay-callback")
    public void payCallbackHandler(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String vnpResponseCode = request.getParameter("vnp_ResponseCode");
        String vnpTxnRef = request.getParameter("vnp_TxnRef"); // Mã đơn hàng

        // URL Frontend của bạn
        final String FRONTEND_URL_SUCCESS = "http://localhost:5173/thanh-toan-thanh-cong";
        final String FRONTEND_URL_FAIL = "http://localhost:5173/thanh-toan-that-bai";

        // Xử lý callback
        if (vnpResponseCode != null && vnpResponseCode.equals("00")) {
            // TODO: Kiểm tra chữ ký vnp_SecureHash và cập nhật trạng thái đơn hàng vào DB

            // Thành công
            String successUrl = FRONTEND_URL_SUCCESS + "?orderId=" + vnpTxnRef;
            response.sendRedirect(successUrl);

        } else {
            // Thất bại
            String failUrl = FRONTEND_URL_FAIL + "?code=" + vnpResponseCode;
            response.sendRedirect(failUrl);
        }
    }

}
