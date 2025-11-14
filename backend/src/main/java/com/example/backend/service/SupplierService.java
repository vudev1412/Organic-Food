package com.example.backend.service;

import com.example.backend.domain.Supplier;
import com.example.backend.domain.User;
import com.example.backend.domain.response.ResSupplierDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface SupplierService {
    Supplier handleCreateSupplier(Supplier supplier);
    ResultPaginationDTO handleGetAllSuppliers(Specification<Supplier> spec, Pageable pageable);
    ResSupplierDTO handleGetSupplierById(Long id);
    ResSupplierDTO handleUpdateSupplier(Long id, Supplier supplier);
    void handleDeleteSupplier(Long id);
}
