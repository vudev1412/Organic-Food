package com.example.backend.controller;

import com.example.backend.domain.Invoice;
import com.example.backend.domain.request.ReqInvoice;
import com.example.backend.domain.response.ResInvoiceDTO;
import com.example.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<ResInvoiceDTO> createInvoice(@RequestBody ReqInvoice req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.handleCreateInvoice(req));
    }

    @GetMapping
    public ResponseEntity<List<ResInvoiceDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.handleGetAllInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResInvoiceDTO> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.handleGetInvoiceById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResInvoiceDTO> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoice) {
        return ResponseEntity.ok(invoiceService.handleUpdateInvoice(id, invoice));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.handleDeleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
