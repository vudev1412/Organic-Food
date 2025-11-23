package com.example.backend.repository;

import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.key.ProductCertificateKey;
import com.example.backend.domain.response.ProductCertificateDetailDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import java.util.List;

public interface ProductCertificateRepository extends JpaRepository<ProductCertificate, ProductCertificateKey>, JpaSpecificationExecutor<ProductCertificate> {
    @Query("SELECT new com.example.backend.domain.response.ProductCertificateDetailDTO(" +
            "  pc.certificate.id, " +
            "  pc.certificate.name, " +
            "  pc.certificate.image, " + // Mapping từ Certificate.image sang typeImageUrl
            "  pc.certNo, " +
            "  pc.date, " +
            "  pc.imageUrl " +          // Mapping từ ProductCertificate.imageUrl sang specificImageUrl
            ") " +
            "FROM ProductCertificate pc " +
            "WHERE pc.product.id = :productId")
    List<ProductCertificateDetailDTO> findProductCertificateDetailsByProductId(@Param("productId") Long productId);
    List<ProductCertificate> findByIdProductId(Long productId);

}
