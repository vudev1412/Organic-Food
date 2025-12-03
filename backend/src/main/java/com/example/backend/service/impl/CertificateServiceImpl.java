package com.example.backend.service.impl;

import com.example.backend.domain.Certificate;
import com.example.backend.domain.response.ResCertificateDTO;
import com.example.backend.mapper.CertificateMapper;
import com.example.backend.repository.CertificateRepository;
import com.example.backend.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository certificateRepository;
    private final CertificateMapper certificateMapper;
    @Override
    public Certificate handleCreateCertificate(Certificate certificate) {
        return this.certificateRepository.save(certificate);
    }

    @Override
    public ResCertificateDTO handleGetCertificateById(Long id) {
        Certificate certificate = this.certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:"+ id));
        return this.certificateMapper.toResCertificateDTO(certificate);
    }

    @Override
    public List<ResCertificateDTO> handleGetAllCertificate() {
        return this.certificateRepository.findAll().stream().map(this.certificateMapper::toResCertificateDTO).toList();
    }

    @Override
    public ResCertificateDTO handleUpdateCertificate(Long id, Certificate certificate) {
        Certificate current = this.certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:"+ id));
        if(certificate.getName() != null){
            current.setName(certificate.getName());
        }
        if(certificate.getImage() != null){
            current.setImage(certificate.getImage());
        }
        this.certificateRepository.save(current);
        return this.certificateMapper.toResCertificateDTO(current);
    }

    @Override
    public void handleDeleteCertificate(Long id) {
        this.certificateRepository.deleteById(id);
    }
}
