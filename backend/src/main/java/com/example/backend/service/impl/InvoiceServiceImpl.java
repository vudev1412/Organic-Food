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

    // Sai số chấp nhận được cho so sánh số thập phân (Ví dụ: 0.0001)
    private static final double EPSILON = 0.0001;

    @Override
    public ResInvoiceDTO handleCreateInvoice(ReqInvoice req) {

        // --- 1. VALIDATE DỮ LIỆU TÍNH TOÁN TỪ CLIENT ---
        validateInvoiceCalculation(req);
        // ------------------------------------------------

        Invoice invoice = new Invoice();

        // Cài đặt các mối quan hệ (giữ nguyên)
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

        // Cài đặt các trường giá trị
        invoice.setDeliverFee(req.getDeliverFee());
        invoice.setDiscountAmount(req.getDiscountAmount());
        invoice.setSubtotal(req.getSubtotal());
        invoice.setStatus(req.getStatus());

        // Cài đặt các trường tính toán (lấy từ req đã được validate)
        invoice.setTaxRate(req.getTaxRate());
        invoice.setTaxAmount(req.getTaxAmount());
        invoice.setTotal(req.getTotal());

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

        // Lấy các giá trị (mới hoặc cũ) để tính toán lại
        double newSubtotal = (invoice.getSubtotal() != 0) ? invoice.getSubtotal() : current.getSubtotal();
        double newDeliverFee = (invoice.getDeliverFee() != 0) ? invoice.getDeliverFee() : current.getDeliverFee();
        double newDiscountAmount = (invoice.getDiscountAmount() != 0) ? invoice.getDiscountAmount() : current.getDiscountAmount();
        double newTaxRate = (invoice.getTaxRate() != 0) ? invoice.getTaxRate() : current.getTaxRate();

        // Cập nhật các trường
        if (invoice.getDeliverFee() != 0)
            current.setDeliverFee(invoice.getDeliverFee());

        if (invoice.getDiscountAmount() != 0)
            current.setDiscountAmount(invoice.getDiscountAmount());

        if (invoice.getSubtotal() != 0)
            current.setSubtotal(invoice.getSubtotal());

        if (invoice.getTaxRate() != 0)
            current.setTaxRate(invoice.getTaxRate());

        if (invoice.getStatus() != null)
            current.setStatus(invoice.getStatus());

        // Bỏ qua việc lấy TaxAmount và Total từ Entity cập nhật và TÍNH TOÁN LẠI để đảm bảo chính xác

        double updatedTaxAmount = newSubtotal * newTaxRate;
        double updatedTotal = newSubtotal + updatedTaxAmount + newDeliverFee - newDiscountAmount;

        current.setTaxAmount(updatedTaxAmount);
        current.setTotal(updatedTotal);

        Invoice updated = invoiceRepository.save(current);
        return invoiceMapper.toResInvoiceDTO(updated);
    }

    @Override
    public void handleDeleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    // ----------------------------------------------------------------------------------
    // LOGIC VALIDATION
    // ----------------------------------------------------------------------------------

    /**
     * Xác thực tính toán TaxAmount và Total từ Request DTO của Client
     * @param req ReqInvoice
     * @throws RuntimeException nếu tính toán không khớp hoặc dữ liệu không hợp lệ
     */
    private void validateInvoiceCalculation(ReqInvoice req) {

        // 1. Kiểm tra giá trị cơ bản
        if (req.getSubtotal() < 0 || req.getTotal() < 0) {
            throw new RuntimeException("Validation Error: Subtotal or Total cannot be negative.");
        }
        if (req.getTaxRate() < 0) {
            throw new RuntimeException("Validation Error: Tax Rate cannot be negative.");
        }

        // 2. Tính toán lại Tax Amount trên Server
        double serverCalculatedTaxAmount = req.getSubtotal() * req.getTaxRate();

        // 3. So sánh Tax Amount (sử dụng EPSILON để so sánh double)
        if (Math.abs(req.getTaxAmount() - serverCalculatedTaxAmount) > EPSILON) {
            throw new RuntimeException("Validation Error: Tax Amount mismatch. Expected " + serverCalculatedTaxAmount + " but received " + req.getTaxAmount() + ".");
        }

        // 4. Tính Total an toàn: sử dụng Tax Amount đã TÍNH LẠI trên server
        double safeTotal =
                req.getSubtotal()
                        + req.getDeliverFee()
                        + serverCalculatedTaxAmount
                        - req.getDiscountAmount();

        // 5. So sánh Total (sử dụng EPSILON để so sánh double)
        if (Math.abs(req.getTotal() - safeTotal) > EPSILON) {
            throw new RuntimeException("Validation Error: Total amount mismatch. Expected " + safeTotal + " but received " + req.getTotal() + ".");
        }
    }
}