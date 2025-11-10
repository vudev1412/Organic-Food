package com.example.backend.controller;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.response.ResReceiptDTO;
import com.example.backend.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    @PostMapping
    public ResponseEntity<ResReceiptDTO> createReceipt(@RequestBody Receipt receipt) {
        Receipt createdReceipt = receiptService.handleCreateReceipt(receipt);
        return ResponseEntity.ok(receiptService.handleGetReceiptById(createdReceipt.getId()));
    }

    @GetMapping
    public ResponseEntity<List<ResReceiptDTO>> getAllReceipts() {
        return ResponseEntity.ok(receiptService.handleGetAllReceipts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResReceiptDTO> getReceiptById(@PathVariable Long id) {
        return ResponseEntity.ok(receiptService.handleGetReceiptById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResReceiptDTO> updateReceipt(@PathVariable Long id, @RequestBody Receipt receipt) {
        return ResponseEntity.ok(receiptService.handleUpdateReceipt(id, receipt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        receiptService.handleDeleteReceipt(id);
        return ResponseEntity.noContent().build();
    }
}
