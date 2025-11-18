package com.example.backend.service.impl;

import com.example.backend.domain.Certificate;
import com.example.backend.domain.Product;
import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.User;
import com.example.backend.domain.key.ProductCertificateKey;
import com.example.backend.domain.request.ReqProductCertificate;
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
    public ResProductCertificate handleCreateProductCertificate(ReqProductCertificate req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Certificate certificate = certificateRepository.findById(req.getCertificateId())
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        ProductCertificate pc = new ProductCertificate();
        pc.setId(new ProductCertificateKey(req.getProductId(), req.getCertificateId()));
        pc.setProduct(product);
        pc.setCertificate(certificate);
        pc.setImageUrl(req.getImageUrl());
        pc.setCertNo(req.getCertNo());
        pc.setDate(req.getDate());
        productCertificateRepository.save(pc);
        return this.productCertificateMapper.toResProductCertificate(pc);
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

    @Override
    public ResProductCertificate handleUpdateProductCertificate(Long productId, Long certificateId, ProductCertificate productCertificate) {
        ProductCertificateKey key = new ProductCertificateKey(productId, certificateId);
        ProductCertificate current = this.productCertificateRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("Not found ProductCertificate with productId=" + productId + " and certificateId=" + certificateId));

        current.setImageUrl(productCertificate.getImageUrl());
        current.setCertNo(productCertificate.getCertNo());
        current.setDate(productCertificate.getDate());

        ProductCertificate updated = this.productCertificateRepository.save(current);
        return this.productCertificateMapper.toResProductCertificate(updated);
    }


    @Override
    public void handleDeleteProductCertificate(Long productId, Long certificateId) {
        ProductCertificateKey key = new ProductCertificateKey(productId, certificateId);
        this.productCertificateRepository.deleteById(key);
    }
}
