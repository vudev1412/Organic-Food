package com.example.backend.controller;

import com.example.backend.domain.Supplier;
import com.example.backend.domain.User;
import com.example.backend.domain.response.ResSupplierDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.service.SupplierService;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('QL NhaCC')")
    public ResponseEntity<ResSupplierDTO> createSupplier(@RequestBody Supplier supplier) {
        Supplier createdSupplier = supplierService.handleCreateSupplier(supplier);
        return ResponseEntity.ok(supplierService.handleGetSupplierById(createdSupplier.getId()));
    }

    @GetMapping
    public ResponseEntity<ResultPaginationDTO> getAllSuppliers(
            @Filter Specification<Supplier> spec,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                supplierService.handleGetAllSuppliers(spec, pageable)
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<ResSupplierDTO> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.handleGetSupplierById(id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('QL NhaCC')")
    public ResponseEntity<ResSupplierDTO> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.handleUpdateSupplier(id, supplier));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('QL NhaCC')")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.handleDeleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
