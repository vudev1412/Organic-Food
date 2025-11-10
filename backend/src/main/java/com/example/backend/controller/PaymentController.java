package com.example.backend.controller;

import com.example.backend.domain.Payment;
import com.example.backend.domain.request.ReqPaymentDTO;
import com.example.backend.domain.response.ResPaymentDTO;
import com.example.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PaymentController {

    private final PaymentService paymentService;

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
