package com.example.backend.service;

import com.example.backend.domain.Certificate;
import com.example.backend.domain.response.ResCertificateDTO;

import java.util.List;

public interface CertificateService {
    public Certificate handleCreateCertificate(Certificate certificate);
    public ResCertificateDTO handleGetCertificateById(Long id);
    public List<ResCertificateDTO> handleGetAllCertificate();
    public ResCertificateDTO handleUpdateCertificate(Long id, Certificate certificate);
    public void handleDeleteCertificate(Long id);
}
