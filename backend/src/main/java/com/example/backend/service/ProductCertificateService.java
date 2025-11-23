package com.example.backend.service;

import com.example.backend.domain.ProductCertificate;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqProductCertificate;
import com.example.backend.domain.request.ReqUpdateProductCertificate;
import com.example.backend.domain.response.ProductCertificateDTO;
import com.example.backend.domain.response.ProductCertificateDetailDTO;
import com.example.backend.domain.response.ResProductCertificate;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface ProductCertificateService {
    ResProductCertificate handleCreateProductCertificate(ReqUpdateProductCertificate productCertificate);
    ResultPaginationDTO handleGetAllProductCertificate(Specification<ProductCertificate> spec, Pageable pageable);
    ResProductCertificate handleGetProductCertificateById(Long productId, Long certificateId);
    ResProductCertificate handleUpdateProductCertificate(Long productId, Long certificateId, ReqUpdateProductCertificate productCertificate);
    void handleDeleteProductCertificate(Long productId, Long certificateId);
<<<<<<< HEAD
    List<ProductCertificateDetailDTO> handleGetCertificateDetailsByProductId(Long productId);
=======
    List<ResProductCertificate> handleGetByProductId(Long id);
>>>>>>> 856c190357b00a1f9dc4ab2ba623ef29197e379d
}
