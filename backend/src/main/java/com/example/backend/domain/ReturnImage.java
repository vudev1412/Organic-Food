package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "return_images")
@Getter
@Setter
public class ReturnImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String imageUrl;

    private Instant uploadedAt;

    @ManyToOne
    @JoinColumn(name = "return_id")
    private Return returns;
}
