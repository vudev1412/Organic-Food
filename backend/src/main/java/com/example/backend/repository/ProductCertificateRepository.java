package com.example.backend.repository;

import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.key.ProductCertificateKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductCertificateRepository extends JpaRepository<ProductCertificate, ProductCertificateKey>, JpaSpecificationExecutor<ProductCertificate> {
    List<ProductCertificate> findByIdProductId(Long productId);
}
