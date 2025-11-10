package com.example.backend.controller;

import com.example.backend.domain.Certificate;
import com.example.backend.domain.response.ResCertificateDTO;
import com.example.backend.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CertificateController {
    private final CertificateService certificateService;

    @PostMapping("/certificates")
    public ResponseEntity<Certificate> createCertificate(@RequestBody Certificate certificate){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.certificateService.handleCreateCertificate(certificate));
    }
    @GetMapping("/certificates/{id}")
    public ResponseEntity<ResCertificateDTO> getCertificateById(@PathVariable Long id){
        return ResponseEntity.ok().body(this.certificateService.handleGetCertificateById(id));
    }
    @GetMapping("/certificates")
    public ResponseEntity<List<ResCertificateDTO>> getAllCertificate(){
        return ResponseEntity.ok().body(this.certificateService.handleGetAllCertificate());
    }
    @PatchMapping("/certificates/{id}")
    public ResponseEntity<ResCertificateDTO> updateCertificate(@PathVariable Long id, @RequestBody Certificate certificate){
        return ResponseEntity.ok().body(this.certificateService.handleUpdateCertificate(id, certificate));
    }
    @DeleteMapping("/certificates/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id){
        this.certificateService.handleDeleteCertificate(id);
        return ResponseEntity.noContent().build();
    }
}
