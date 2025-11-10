package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.request.ReqInvoice;
import com.example.backend.domain.response.ResInvoiceDTO;
import com.example.backend.mapper.InvoiceMapper;
import com.example.backend.repository.*;
import com.example.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final VoucherRepository voucherRepository;

    @Override
    public ResInvoiceDTO handleCreateInvoice(ReqInvoice req) {
        Invoice invoice = new Invoice();

        if (req.getOrderId() != null) {
            Order order = orderRepository.findById(req.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            invoice.setOrder(order);
        }

        if (req.getCustomerId() != null) {
            User customer = userRepository.findById(req.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            invoice.setCustomer(customer);
        }

        if (req.getEmployeeId() != null) {
            User employee = userRepository.findById(req.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
            invoice.setEmployee(employee);
        }

        if (req.getPaymentId() != null) {
            Payment payment = paymentRepository.findById(req.getPaymentId())
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
            invoice.setPayment(payment);
        }

        if (req.getVoucherId() != null) {
            Voucher voucher = voucherRepository.findById(req.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
            invoice.setVoucher(voucher);
        }

        invoice.setDeliverFee(req.getDeliverFee());
        invoice.setDiscountAmount(req.getDiscountAmount());
        invoice.setSubtotal(req.getSubtotal());
        invoice.setStatus(req.getStatus());

        Invoice saved = invoiceRepository.save(invoice);
        return invoiceMapper.toResInvoiceDTO(saved);
    }

    @Override
    public List<ResInvoiceDTO> handleGetAllInvoices() {
        return invoiceRepository.findAll()
                .stream()
                .map(invoiceMapper::toResInvoiceDTO)
                .toList();
    }

    @Override
    public ResInvoiceDTO handleGetInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return invoiceMapper.toResInvoiceDTO(invoice);
    }

    @Override
    public ResInvoiceDTO handleUpdateInvoice(Long id, Invoice invoice) {
        Invoice current = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getDeliverFee() != 0)
            current.setDeliverFee(invoice.getDeliverFee());

        if (invoice.getDiscountAmount() != 0)
            current.setDiscountAmount(invoice.getDiscountAmount());

        if (invoice.getSubtotal() != 0)
            current.setSubtotal(invoice.getSubtotal());

        if (invoice.getStatus() != null)
            current.setStatus(invoice.getStatus());

        Invoice updated = invoiceRepository.save(current);
        return invoiceMapper.toResInvoiceDTO(updated);
    }

    @Override
    public void handleDeleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}
