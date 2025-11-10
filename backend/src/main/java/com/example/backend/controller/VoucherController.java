package com.example.backend.controller;

import com.example.backend.domain.Voucher;
import com.example.backend.domain.response.ResVoucherDTO;
import com.example.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @PostMapping
    public ResponseEntity<ResVoucherDTO> createVoucher(@RequestBody Voucher voucher) {
        Voucher createdVoucher = voucherService.handleCreateVoucher(voucher);
        return ResponseEntity.ok(voucherService.handleGetVoucherById(createdVoucher.getId()));
    }

    // Get all vouchers
    @GetMapping
    public ResponseEntity<List<ResVoucherDTO>> getAllVouchers() {
        List<ResVoucherDTO> vouchers = voucherService.handleGetAllVoucher();
        return ResponseEntity.ok(vouchers);
    }

    // Get voucher by ID
    @GetMapping("/{id}")
    public ResponseEntity<ResVoucherDTO> getVoucherById(@PathVariable Long id) {
        ResVoucherDTO voucherDTO = voucherService.handleGetVoucherById(id);
        return ResponseEntity.ok(voucherDTO);
    }

    // Update voucher (patch-like update)
    @PatchMapping("/{id}")
    public ResponseEntity<ResVoucherDTO> updateVoucher(@PathVariable Long id, @RequestBody Voucher voucher) {
        ResVoucherDTO updatedVoucher = voucherService.handleUpdateVoucher(id, voucher);
        return ResponseEntity.ok(updatedVoucher);
    }

    // Delete voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable Long id) {
        voucherService.handleDeleteVoucher(id);
        return ResponseEntity.noContent().build();
    }

}
