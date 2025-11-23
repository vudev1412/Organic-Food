package com.example.backend.service.impl;

import com.example.backend.domain.Certificate;
import com.example.backend.domain.Product;
import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.User;
import com.example.backend.domain.key.ProductCertificateKey;
import com.example.backend.domain.request.ReqProductCertificate;
import com.example.backend.domain.request.ReqUpdateProductCertificate;
import com.example.backend.domain.response.ProductCertificateDTO;
import com.example.backend.domain.response.ResProductCertificate;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.mapper.ProductCertificateMapper;
import com.example.backend.repository.CertificateRepository;
import com.example.backend.repository.ProductCertificateRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductCertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductCertificateServiceImpl implements ProductCertificateService {
    private final ProductCertificateRepository productCertificateRepository;
    private final ProductCertificateMapper productCertificateMapper;
    private final ProductRepository productRepository;
    private final CertificateRepository certificateRepository;


    @Override
    @Transactional
    public ResProductCertificate handleCreateProductCertificate(ReqUpdateProductCertificate req) {
        Certificate certificate = certificateRepository.findById(req.getCertificate().getId())
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        // Tạo Product mới
        Product product = new Product();
        product.setName(req.getProduct().getName());
        product.setUnit(req.getProduct().getUnit());
        product.setPrice(req.getProduct().getPrice());
        product.setQuantity(req.getProduct().getQuantity());
        product.setActive(req.getProduct().isActive());
        product.setOrigin_address(req.getProduct().getOrigin_address());
        product.setDescription(req.getProduct().getDescription());
        product.setExpDate(req.getProduct().getExpDate());
        product.setMfgDate(req.getProduct().getMfgDate());
        product.setImage("123.png");
        product = productRepository.save(product); // lưu Product mới

        // Tạo ProductCertificate
        ProductCertificate pc = new ProductCertificate();
        pc.setId(new ProductCertificateKey(product.getId(), certificate.getId()));
        pc.setProduct(product);
        pc.setCertificate(certificate);
        pc.setImageUrl("default.png");
        pc.setCertNo(req.getCertNo());
        pc.setDate(Instant.now());

        ProductCertificate saved = productCertificateRepository.save(pc);

        return productCertificateMapper.toResProductCertificate(saved);
    }

    @Override
    public ResultPaginationDTO handleGetAllProductCertificate(Specification<ProductCertificate> spec, Pageable pageable) {

        Page<ProductCertificate> pagePC = this.productCertificateRepository.findAll(spec, pageable);

        // META
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pagePC.getTotalPages());
        meta.setTotal(pagePC.getTotalElements());
        rs.setMeta(meta);

        List<ProductCertificateDTO> dtoList = pagePC.getContent()
                .stream()
                .map(productCertificateMapper::toDTO)
                .toList();

        rs.setResult(dtoList);

        return rs;
    }


    @Override
    public ResProductCertificate handleGetProductCertificateById(Long productId, Long certificateId) {
        ProductCertificateKey key = new ProductCertificateKey(productId, certificateId);
        ProductCertificate productCertificate = this.productCertificateRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("Not found ProductCertificate with productId=" + productId + " and certificateId=" + certificateId));
        return this.productCertificateMapper.toResProductCertificate(productCertificate);
    }

    @Transactional
    public ResProductCertificate handleUpdateProductCertificate(Long productId, Long certificateId, ReqUpdateProductCertificate req) {
        ProductCertificateKey key = new ProductCertificateKey(productId, certificateId);
        ProductCertificate current = productCertificateRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("Not found ProductCertificate with productId=" + productId + " and certificateId=" + certificateId));

        // Cập nhật ProductCertificate fields
        if (req.getImageUrl() != null) current.setImageUrl(req.getImageUrl());
        if (req.getCertNo() != null) current.setCertNo(req.getCertNo());
        if (req.getDate() != null) current.setDate(req.getDate());

        // Cập nhật Product fields nếu có
        if (req.getProduct() != null && req.getProduct().getId() != 0) {
            Product product = productRepository.findById(req.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id=" + req.getProduct().getId()));
            if (req.getProduct().getName() != null) product.setName(req.getProduct().getName());
            if (req.getProduct().getUnit() != null) product.setUnit(req.getProduct().getUnit());
            if (req.getProduct().getPrice() > -1) product.setPrice(req.getProduct().getPrice());
            if (req.getProduct().getQuantity() > -1) product.setQuantity(req.getProduct().getQuantity());
            product.setActive(req.getProduct().isActive());
            if (req.getProduct().getOrigin_address() != null) product.setOrigin_address(req.getProduct().getOrigin_address());
            if (req.getProduct().getDescription() != null) product.setDescription(req.getProduct().getDescription());
            if (req.getProduct().getSlug() != null) product.setSlug(req.getProduct().getSlug());
            if (req.getProduct().getMfgDate() != null) product.setMfgDate(req.getProduct().getMfgDate());
            if (req.getProduct().getMfgDate() != null)
                product.setMfgDate(req.getProduct().getMfgDate());
            if (req.getProduct().getExpDate() != null)
                product.setExpDate(req.getProduct().getExpDate());
        }

        // Nếu muốn đổi certificateId
        if (req.getCertificate() != null && req.getCertificate().getId() != certificateId) {
            Certificate newCert = certificateRepository.findById(req.getCertificate().getId())
                    .orElseThrow(() -> new RuntimeException("Certificate not found with id=" + req.getCertificate().getId()));

            // Xóa record cũ
            productCertificateRepository.delete(current);

            // Tạo mới với certificate mới
            ProductCertificate newRecord = new ProductCertificate();
            newRecord.setId(new ProductCertificateKey(productId, newCert.getId()));
            newRecord.setProduct(current.getProduct());
            newRecord.setCertificate(newCert);
            newRecord.setImageUrl(current.getImageUrl());
            newRecord.setCertNo(current.getCertNo());
            newRecord.setDate(current.getDate());

            // Lưu và trả về
            ProductCertificate saved = productCertificateRepository.save(newRecord);
            return productCertificateMapper.toResProductCertificate(saved);
        }

        // Nếu không đổi certificateId thì lưu bình thường
        ProductCertificate updated = productCertificateRepository.save(current);
        return productCertificateMapper.toResProductCertificate(updated);
    }





    @Override
    public void handleDeleteProductCertificate(Long productId, Long certificateId) {
        ProductCertificateKey key = new ProductCertificateKey(productId, certificateId);
        this.productCertificateRepository.deleteById(key);
        ProductCertificate pc = productCertificateRepository.findById(key)
                .orElseThrow(() -> new RuntimeException(
                        "ProductCertificate not found with productId=" + productId + " and certificateId=" + certificateId
                ));
        Product product = pc.getProduct();
        if (product != null) {
            productRepository.delete(product);
        }
    }

    @Override
    public List<ResProductCertificate> handleGetByProductId(Long id) {
        return this.productCertificateRepository.findByIdProductId(id).stream().map(this.productCertificateMapper::toResProductCertificate).toList();
    }
}
