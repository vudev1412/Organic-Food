package com.example.backend.service.impl;

import com.example.backend.domain.Supplier;
import com.example.backend.domain.response.ResSupplierDTO;
import com.example.backend.mapper.SupplierMapper;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    @Override
    public Supplier handleCreateSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public List<ResSupplierDTO> handleGetAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(supplierMapper::toResSupplierDTO)
                .toList();
    }

    @Override
    public ResSupplierDTO handleGetSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        return supplierMapper.toResSupplierDTO(supplier);
    }

    @Override
    public ResSupplierDTO handleUpdateSupplier(Long id, Supplier supplier) {
        Supplier currentSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        if (supplier.getName() != null) currentSupplier.setName(supplier.getName());
        if (supplier.getCode() != null) currentSupplier.setCode(supplier.getCode());
        if (supplier.getTaxNo() != null) currentSupplier.setTaxNo(supplier.getTaxNo());
        if (supplier.getPhone() != null) currentSupplier.setPhone(supplier.getPhone());
        if (supplier.getEmail() != null) currentSupplier.setEmail(supplier.getEmail());
        if (supplier.getAddress() != null) currentSupplier.setAddress(supplier.getAddress());

        supplierRepository.save(currentSupplier);

        return supplierMapper.toResSupplierDTO(currentSupplier);
    }

    @Override
    public void handleDeleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}
