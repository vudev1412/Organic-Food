package com.example.backend.controller;

import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqProductCertificate;
import com.example.backend.domain.response.ProductCertificateDTO;
import com.example.backend.domain.response.ProductCertificateDetailDTO;
import com.example.backend.domain.response.ResProductCertificate;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.service.ProductCertificateService;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ProductCertificateController {

    private final ProductCertificateService productCertificateService;

    @PostMapping("/product-certificates")
    public ResponseEntity<ResProductCertificate> createProductCertificate(@RequestBody ReqProductCertificate productCertificate) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.productCertificateService.handleCreateProductCertificate(productCertificate));
    }

    @GetMapping("/product-certificates")
    public ResponseEntity<ResultPaginationDTO> getAllProductCertificates(@Filter Specification<ProductCertificate> spec, Pageable pageable) {
        return ResponseEntity.ok().body(this.productCertificateService.handleGetAllProductCertificate(spec,pageable));
    }

    @GetMapping("/product-certificates/{productId}/{certificateId}")
    public ResponseEntity<ResProductCertificate> getProductCertificateById(
            @PathVariable Long productId, @PathVariable Long certificateId) {
        return ResponseEntity.ok().body(this.productCertificateService.handleGetProductCertificateById(productId, certificateId));
    }

    @PatchMapping("/product-certificates/{productId}/{certificateId}")
    public ResponseEntity<ResProductCertificate> updateProductCertificate(
            @PathVariable Long productId,
            @PathVariable Long certificateId,
            @RequestBody ProductCertificate productCertificate) {
        return ResponseEntity.ok().body(this.productCertificateService.handleUpdateProductCertificate(productId, certificateId, productCertificate));
    }

    @DeleteMapping("/product-certificates/{productId}/{certificateId}")
    public ResponseEntity<Void> deleteProductCertificate(
            @PathVariable Long productId, @PathVariable Long certificateId) {
        this.productCertificateService.handleDeleteProductCertificate(productId, certificateId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/products/{productId}/certificate-details")
    public ResponseEntity<List<ProductCertificateDetailDTO>> getCertificateDetailsByProductId(@PathVariable Long productId) {
        List<ProductCertificateDetailDTO> details = this.productCertificateService.handleGetCertificateDetailsByProductId(productId);
        return ResponseEntity.ok().body(details);
    }
}
