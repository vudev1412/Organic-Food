package com.example.backend.service.impl;

import com.example.backend.domain.Supplier;
import com.example.backend.domain.User;
import com.example.backend.domain.response.ResSupplierDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.mapper.SupplierMapper;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
    public ResultPaginationDTO handleGetAllSuppliers(Specification<Supplier> spec, Pageable pageable) {

        Page<Supplier> pageSupplier = this.supplierRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageSupplier.getTotalPages());
        meta.setTotal(pageSupplier.getTotalElements());

        rs.setMeta(meta);

        List<ResSupplierDTO> list = pageSupplier.getContent()
                .stream().map(item -> new ResSupplierDTO(
                        item.getId(),
                        item.getName(),
                        item.getCode(),
                        item.getTaxNo(),
                        item.getPhone(),
                        item.getEmail(),
                        item.getAddress()
                )).collect(Collectors.toList());

        rs.setResult(list);
        return rs;
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
