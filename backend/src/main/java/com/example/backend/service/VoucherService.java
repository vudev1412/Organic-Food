package com.example.backend.service;

import com.example.backend.domain.Voucher;
import com.example.backend.domain.response.ResVoucherDTO;

import java.util.List;

public interface VoucherService {
    Voucher handleCreateVoucher(Voucher voucher);
    List<ResVoucherDTO> handleGetAllVoucher();
    ResVoucherDTO handleGetVoucherById(Long id);
    ResVoucherDTO handleUpdateVoucher(Long id, Voucher voucher);
    void handleDeleteVoucher(Long id);
    ResVoucherDTO handleGetVoucherByCode(String code);
}
