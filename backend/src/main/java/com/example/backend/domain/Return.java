package com.example.backend.domain;

import com.example.backend.enums.StatusReturn;
import com.example.backend.enums.TypeReturn;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "returns")
@Getter
@Setter
public class Return {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String reason;

    private StatusReturn status;

    private TypeReturn returnType;

    private Instant createdAt;

    private Instant approvedAt;

    private int processedBy;

    private String processNote;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @OneToMany(mappedBy = "returns", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReturnItem> returnItems = new ArrayList<>();

    @OneToMany(mappedBy = "returns", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReturnImage> returnImages = new ArrayList<>();
}
