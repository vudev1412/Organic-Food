package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.request.ReqPaymentDTO;
import com.example.backend.domain.response.*;
import com.example.backend.mapper.PaymentMapper;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    public List<PaymentDTO> getAllPayments() {
        List<Payment> payments = paymentRepository.findAllWithRelations();

        return payments.stream()
                .map(this::convertToPaymentDTO)
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

    private PaymentDTO convertToPaymentDTO(Payment p) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(p.getId());
        dto.setMethod(p.getMethod());
        dto.setProvider(p.getProvider());
        dto.setStatus(p.getStatus());
        dto.setAmount(p.getAmount());
        dto.setCreateAt(p.getCreateAt());

        dto.setInvoices(
                p.getInvoices() != null
                        ? p.getInvoices().stream().map(this::convertToInvoiceDTO).toList()
                        : null
        );

        return dto;
    }
    private InvoiceDTO convertToInvoiceDTO(Invoice i) {
        InvoiceDTO dto = new InvoiceDTO();

        dto.setId(i.getId());
        dto.setCreateAt(i.getCreateAt());
        dto.setDeliverFee(i.getDeliverFee());
        dto.setDiscountAmount(i.getDiscountAmount());
        dto.setSubtotal(i.getSubtotal());
        dto.setTaxRate(i.getTaxRate());
        dto.setTaxAmount(i.getTaxAmount());
        dto.setTotal(i.getTotal());
        dto.setStatus(i.getStatus());

        dto.setOrder(i.getOrder() != null ? convertToOrderDTO(i.getOrder()) : null);
        dto.setCustomer(i.getCustomer() != null ? convertToUserDTO(i.getCustomer()) : null);
        dto.setEmployee(i.getEmployee() != null ? convertToUserDTO(i.getEmployee()) : null);
        dto.setVoucher(i.getVoucher() != null ? convertToVoucherDTO(i.getVoucher()) : null);

        return dto;
    }
    private OrderDTO convertToOrderDTO(Order order) {
        if (order == null) return null;

        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderAt(order.getOrderAt());
        dto.setNote(order.getNote());
        dto.setStatusOrder(order.getStatusOrder());
        dto.setShipAddress(order.getShipAddress());
        dto.setEstimatedDate(order.getEstimatedDate());
        // Không cần fetch orderDetails nếu không muốn quá nặng,
        // nhưng có thể thêm nếu muốn trả về danh sách sản phẩm
        return dto;
    }
    private UserDTO convertToUserDTO(User user) {
        if (user == null) return null;

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        // Nếu cần thêm phone hoặc các trường khác, có thể map thêm
        // dto.setPhone(user.getPhone());
        return dto;
    }
    private VoucherDTO convertToVoucherDTO(Voucher voucher) {
        if (voucher == null) return null;

        VoucherDTO dto = new VoucherDTO();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setDiscount(voucher.getMaxDiscountAmount());
        // Nếu có các trường khác như startDate, endDate, có thể map thêm
        return dto;
    }





}
