package com.example.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "certificates")
@Getter
@Setter
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    private String image;

    @OneToMany(mappedBy = "certificate", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<ProductCertificate> productCertificates = new HashSet<>();

}
