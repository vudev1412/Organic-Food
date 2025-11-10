package com.example.backend.controller;

import com.example.backend.domain.Supplier;
import com.example.backend.domain.response.ResSupplierDTO;
import com.example.backend.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    public ResponseEntity<ResSupplierDTO> createSupplier(@RequestBody Supplier supplier) {
        Supplier createdSupplier = supplierService.handleCreateSupplier(supplier);
        return ResponseEntity.ok(supplierService.handleGetSupplierById(createdSupplier.getId()));
    }

    @GetMapping
    public ResponseEntity<List<ResSupplierDTO>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.handleGetAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResSupplierDTO> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.handleGetSupplierById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResSupplierDTO> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.handleUpdateSupplier(id, supplier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.handleDeleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
