package com.example.backend.controller;

import com.example.backend.domain.request.ReqReceiptDetailDTO;
import com.example.backend.domain.response.ResReceiptDetailDTO;
import com.example.backend.service.ReceiptDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/receipt-details")
@RequiredArgsConstructor
public class ReceiptDetailController {

    private final ReceiptDetailService receiptDetailService;

    @GetMapping
    public ResponseEntity<List<ResReceiptDetailDTO>> getAll() {
        return ResponseEntity.ok(receiptDetailService.getAll());
    }

    @PostMapping
    public ResponseEntity<ResReceiptDetailDTO> create(@RequestBody ReqReceiptDetailDTO dto) {
        return ResponseEntity.ok(receiptDetailService.create(dto));
    }

    @PutMapping("/{receiptId}/{productId}")
    public ResponseEntity<ResReceiptDetailDTO> update(
            @PathVariable long receiptId,
            @PathVariable long productId,
            @RequestBody ReqReceiptDetailDTO dto
    ) {
        return ResponseEntity.ok(receiptDetailService.update(receiptId, productId, dto));
    }

    @DeleteMapping("/{receiptId}/{productId}")
    public ResponseEntity<Void> delete(
            @PathVariable long receiptId,
            @PathVariable long productId
    ) {
        receiptDetailService.delete(receiptId, productId);
        return ResponseEntity.noContent().build();
    }
}
