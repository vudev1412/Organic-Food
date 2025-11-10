package com.example.backend.service;

import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.request.ReqProductCertificate;
import com.example.backend.domain.response.ResProductCertificate;

import java.util.List;

public interface ProductCertificateService {
    ResProductCertificate handleCreateProductCertificate(ReqProductCertificate productCertificate);
    List<ResProductCertificate> handleGetAllProductCertificate();
    ResProductCertificate handleGetProductCertificateById(Long productId, Long certificateId);
    ResProductCertificate handleUpdateProductCertificate(Long productId, Long certificateId, ProductCertificate productCertificate);
    void handleDeleteProductCertificate(Long productId, Long certificateId);
}
