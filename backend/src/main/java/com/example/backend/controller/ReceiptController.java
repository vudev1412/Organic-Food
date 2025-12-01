package com.example.backend.controller;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.request.ReqCreateReceiptDTO;
import com.example.backend.domain.response.ResReceiptDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.service.ReceiptService;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    @PostMapping
    public ResponseEntity<ResReceiptDTO> createReceipt(@RequestBody ReqCreateReceiptDTO receipt) {
        return ResponseEntity.ok(receiptService.handleCreateReceipt(receipt));
    }

    @GetMapping
    public ResponseEntity<ResultPaginationDTO> getAllReceipts(@Filter  Specification<Receipt> spec, Pageable pageable) {
        return ResponseEntity.ok(receiptService.handleGetAllReceipts(spec, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResReceiptDTO> getReceiptById(@PathVariable Long id) {
        return ResponseEntity.ok(receiptService.handleGetReceiptById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResReceiptDTO> updateReceipt(@PathVariable Long id, @RequestBody ReqCreateReceiptDTO receipt) {
        return ResponseEntity.ok(receiptService.handleUpdateReceipt(id, receipt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        receiptService.deleteReceipt(id);
        return ResponseEntity.noContent().build();
    }
}
