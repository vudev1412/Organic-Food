package com.example.backend.service;

import com.example.backend.domain.Payment;
import com.example.backend.domain.request.ReqPaymentDTO;
import com.example.backend.domain.response.ResPaymentDTO;

import java.util.List;

public interface PaymentService {

    ResPaymentDTO createPayment(ReqPaymentDTO req);

    List<ResPaymentDTO> getAllPayments();

    ResPaymentDTO getPaymentById(Long id);

    ResPaymentDTO updatePayment(Long id, Payment payment);

    void deletePayment(Long id);
}
