package com.example.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name ="units")
@Getter
@Setter
public class Unit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @OneToMany(mappedBy = "units",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Product> products;


}
