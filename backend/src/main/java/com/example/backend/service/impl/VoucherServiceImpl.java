package com.example.backend.service.impl;

import com.example.backend.domain.Voucher;
import com.example.backend.domain.response.ResVoucherDTO;
import com.example.backend.mapper.VoucherMapper;
import com.example.backend.repository.VoucherRepository;
import com.example.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;
    @Override
    public Voucher handleCreateVoucher(Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    @Override
    public List<ResVoucherDTO> handleGetAllVoucher() {
        return voucherRepository.findAll().stream()
                .map(voucherMapper::toResVoucherDTO)
                .toList();
    }

    @Override
    public ResVoucherDTO handleGetVoucherById(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));
        return voucherMapper.toResVoucherDTO(voucher);
    }

    @Override
    public ResVoucherDTO handleUpdateVoucher(Long id, Voucher voucher) {
        Voucher currentVoucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));

        if (voucher.getCode() != null) {
            currentVoucher.setCode(voucher.getCode());
        }
        if (voucher.getDescription() != null) {
            currentVoucher.setDescription(voucher.getDescription());
        }
        if (voucher.getTypeVoucher() != null) {
            currentVoucher.setTypeVoucher(voucher.getTypeVoucher());
        }
        if (voucher.getValue() > 0) {
            currentVoucher.setValue(voucher.getValue());
        }
        if (voucher.getMaxDiscountAmount() > 0) {
            currentVoucher.setMaxDiscountAmount(voucher.getMaxDiscountAmount());
        }
        if (voucher.getMinOrderValue() > 0) {
            currentVoucher.setMinOrderValue(voucher.getMinOrderValue());
        }
        if (voucher.getStartDate() != null) {
            currentVoucher.setStartDate(voucher.getStartDate());
        }
        if (voucher.getEndDate() != null) {
            currentVoucher.setEndDate(voucher.getEndDate());
        }
        if (voucher.getQuantity() > 0) {
            currentVoucher.setQuantity(voucher.getQuantity());
        }
        if (voucher.getUsedCount() > 0) {
            currentVoucher.setUsedCount(voucher.getUsedCount());
        }
        currentVoucher.setActive(voucher.isActive());

        voucherRepository.save(currentVoucher);

        return voucherMapper.toResVoucherDTO(currentVoucher);
    }

    @Override
    public void handleDeleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }
    @Override
    public ResVoucherDTO handleGetVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher với code " + code + " không tồn tại"));
        return voucherMapper.toResVoucherDTO(voucher);
    }

    @Override
    public List<ResVoucherDTO> handleGetAvailableVouchers() {
        // 1. Lấy Instant hiện tại
        Instant now = Instant.now();

        // 2. Gọi phương thức tìm kiếm từ Repository (Không thay đổi)
        List<Voucher> availableVouchers = voucherRepository.findAvailableVouchers(now);

        // 3. Mapping sang DTO sử dụng MapStruct
        return availableVouchers.stream()
                // Sử dụng VoucherMapper đã inject
                .map(voucherMapper::toResVoucherDTO)
                .collect(Collectors.toList());
    }
}
