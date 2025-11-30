package com.example.backend.service;

import com.example.backend.domain.User;
import com.example.backend.domain.Voucher;
import com.example.backend.domain.response.ResVoucherDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface VoucherService {
    Voucher handleCreateVoucher(Voucher voucher);
    ResultPaginationDTO handleGetAllVoucher(Specification<Voucher> spec, Pageable pageable);
    ResVoucherDTO handleGetVoucherById(Long id);
    ResVoucherDTO handleUpdateVoucher(Long id, Voucher voucher);
    void handleDeleteVoucher(Long id);
    ResVoucherDTO handleGetVoucherByCode(String code);
    List<ResVoucherDTO> handleGetAvailableVouchers();
}
