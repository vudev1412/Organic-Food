package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.key.ReceiptDetailKey;
import com.example.backend.domain.request.ReqCreateReceiptDTO;
import com.example.backend.domain.response.*;
import com.example.backend.domain.response.ProductDTO;
import com.example.backend.enums.StatusReceipt;
import com.example.backend.mapper.ReceiptMapper;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReceiptRepository;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptMapper receiptMapper;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public ResReceiptDTO handleCreateReceipt(ReqCreateReceiptDTO request) {
        Receipt receipt = new Receipt();
        receipt.setDeliverName(request.getDeliverName());
        receipt.setShipDate(request.getShipDate());
        receipt.setDiscount(request.getDiscount());
        receipt.setCreatedAt(Instant.now());
        receipt.setStatus(StatusReceipt.PENDING);

        // Set Supplier
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        receipt.setSupplier(supplier);

        // Set User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        receipt.setUser(user);

        // Map ReceiptDetail
        List<ReceiptDetail> details = request.getDetails().stream().map(d -> {
            Product product = productRepository.findById(d.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            ReceiptDetail rd = new ReceiptDetail();
            rd.setReceipt(receipt);
            rd.setProduct(product);
            rd.setQuantity(d.getQuantity());
            rd.setImportPrice(d.getImportPrice());

            // Set EmbeddedId
            rd.setId(new ReceiptDetailKey(receipt.getId(), product.getId()));
            return rd;
        }).toList();

        receipt.setReceiptDetails(details);

        // Tính totalAmount
        double total = details.stream()
                .mapToDouble(d -> d.getQuantity() * d.getImportPrice())
                .sum();
        receipt.setTotalAmount(total - request.getDiscount());

        // Save
        Receipt saved = receiptRepository.save(receipt);

        // Map sang DTO trả về
        return mapToDTO(saved);
    }

    public ResReceiptDTO mapToDTO(Receipt receipt) {
        Supplier supplier = receipt.getSupplier();
        SupplierDTO supplierDTO = new SupplierDTO(
                supplier.getId(),
                supplier.getName(),
                supplier.getCode(),
                supplier.getTaxNo(),
                supplier.getPhone(),
                supplier.getEmail(),
                supplier.getAddress()
        );
        User user = receipt.getUser();
        UserDTO userDTO = null;
        if (user != null) {
            userDTO = new UserDTO(
                    user.getId(),
                    user.getName(),
                    user.getEmail()
            );
        }

        List<ReceiptDetailDTO> detailDTOs = receipt.getReceiptDetails().stream()
                .map(rd -> new ReceiptDetailDTO(
                        rd.getQuantity(),
                        rd.getImportPrice(),
                        new ProductDTO(
                                rd.getProduct().getId(),
                                rd.getProduct().getName(),
                                rd.getProduct().getPrice()
                        )
                ))
                .toList();

        return new ResReceiptDTO(
                receipt.getId(),
                receipt.getDeliverName(),
                receipt.getDiscount(),
                receipt.getTotalAmount(),
                receipt.getShipDate(),
                supplierDTO,
                userDTO,
                detailDTOs
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ResultPaginationDTO handleGetAllReceipts(
            Specification<Receipt> spec,
            Pageable pageable
    ) {
        Page<Receipt> pageReceipt = receiptRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageReceipt.getTotalPages());
        meta.setTotal(pageReceipt.getTotalElements());

        rs.setMeta(meta);

        List<ResReceiptDTO> data = pageReceipt.getContent()
                .stream()
                .map(this::mapToDTO)
                .toList();

        rs.setResult(data);

        return rs;
    }


    @Transactional(readOnly = true)
    public ResReceiptDTO handleGetReceiptById(Long id) {
        Receipt receipt = receiptRepository.findByIdWithDetails(id);
        if (receipt == null) throw new RuntimeException("Receipt not found");
        return mapToDTO(receipt);
    }

    @Override
    public ResReceiptDTO handleUpdateReceipt(Long id, ReqCreateReceiptDTO request) {
        Receipt receipt = receiptRepository.findByIdWithDetails(id);
        if (receipt == null) throw new RuntimeException("Receipt not found");

        receipt.setDeliverName(request.getDeliverName());
        receipt.setShipDate(request.getShipDate());
        receipt.setDiscount(request.getDiscount());

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        receipt.setSupplier(supplier);



        // Clear existing details
        receipt.getReceiptDetails().clear();

        // Create new details with proper EmbeddedId initialization
        List<ReceiptDetail> details = request.getDetails().stream().map(d -> {
            Product product = productRepository.findById(d.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            ReceiptDetail rd = new ReceiptDetail();

            // Initialize the composite key FIRST
            ReceiptDetailKey key = new ReceiptDetailKey();
            key.setReceiptId(id);  // or receipt.getId()
            key.setProductId(product.getId());
            rd.setId(key);

            // Then set the relationships
            rd.setReceipt(receipt);
            rd.setProduct(product);
            rd.setQuantity(d.getQuantity());
            rd.setImportPrice(d.getImportPrice());

            return rd;
        }).toList();

        receipt.getReceiptDetails().addAll(details);

        // Calculate total
        double total = details.stream()
                .mapToDouble(d -> d.getQuantity() * d.getImportPrice())
                .sum();
        receipt.setTotalAmount(total - request.getDiscount());

        Receipt updated = receiptRepository.save(receipt);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteReceipt(Long id) {
        receiptRepository.deleteByIdCustom(id);
    }
}
