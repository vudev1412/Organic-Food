package com.example.backend.service;

import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqProductCertificate;
import com.example.backend.domain.response.ProductCertificateDTO;
import com.example.backend.domain.response.ProductCertificateDetailDTO;
import com.example.backend.domain.response.ResProductCertificate;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface ProductCertificateService {
    ResProductCertificate handleCreateProductCertificate(ReqProductCertificate productCertificate);
    ResultPaginationDTO handleGetAllProductCertificate(Specification<ProductCertificate> spec, Pageable pageable);
    ResProductCertificate handleGetProductCertificateById(Long productId, Long certificateId);
    ResProductCertificate handleUpdateProductCertificate(Long productId, Long certificateId, ProductCertificate productCertificate);
    void handleDeleteProductCertificate(Long productId, Long certificateId);
    List<ProductCertificateDetailDTO> handleGetCertificateDetailsByProductId(Long productId);
}
