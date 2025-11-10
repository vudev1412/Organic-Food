package com.example.backend.service;

import com.example.backend.domain.Supplier;
import com.example.backend.domain.response.ResSupplierDTO;

import java.util.List;

public interface SupplierService {
    Supplier handleCreateSupplier(Supplier supplier);
    List<ResSupplierDTO> handleGetAllSuppliers();
    ResSupplierDTO handleGetSupplierById(Long id);
    ResSupplierDTO handleUpdateSupplier(Long id, Supplier supplier);
    void handleDeleteSupplier(Long id);
}
