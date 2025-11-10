package com.example.backend.service.impl;

import com.example.backend.domain.Payment;
import com.example.backend.domain.request.ReqPaymentDTO;
import com.example.backend.domain.response.ResPaymentDTO;
import com.example.backend.mapper.PaymentMapper;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    @Override
    public ResPaymentDTO createPayment(ReqPaymentDTO req) {
        Payment payment = new Payment();
        payment.setMethod(req.getMethod());
        payment.setProvider(req.getProvider());
        payment.setStatus(req.getStatus());
        payment.setAmount(req.getAmount());
        payment.setCreateAt(req.getCreateAt());

        paymentRepository.save(payment);
        return paymentMapper.toResPaymentDTO(payment);
    }

    @Override
    public List<ResPaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toResPaymentDTO)
                .toList();
    }

    @Override
    public ResPaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id=" + id));
        return paymentMapper.toResPaymentDTO(payment);
    }

    @Override
    public ResPaymentDTO updatePayment(Long id, Payment payment) {
        Payment current = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id=" + id));

        if(payment.getMethod() != null) current.setMethod(payment.getMethod());
        if(payment.getProvider() != null) current.setProvider(payment.getProvider());
        if(payment.getStatus() != null) current.setStatus(payment.getStatus());
        if(payment.getAmount() > 0) current.setAmount(payment.getAmount());
        if(payment.getCreateAt() != null) current.setCreateAt(payment.getCreateAt());

        paymentRepository.save(current);
        return paymentMapper.toResPaymentDTO(current);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
