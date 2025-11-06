package com.example.backend.domain;

import com.example.backend.enums.TypePromotion;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "promotions")
@Getter
@Setter
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePromotion type;

    @Column(nullable = false)
    private double value;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean is_active;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<PromotionDetail> promotionDetails = new HashSet<>();


}
