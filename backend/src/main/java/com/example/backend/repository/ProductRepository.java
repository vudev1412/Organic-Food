package com.example.backend.repository;

import com.example.backend.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> getProductByCategory_Id(Long categoryId);
    Page<Product> findAllByCategoryIdIn(List<Long> categoryId, Pageable pageable);
    @Query("""
    SELECT DISTINCT p
    FROM Product p
    LEFT JOIN FETCH p.productCertificates pc
    LEFT JOIN FETCH pc.certificate c
    LEFT JOIN FETCH p.productImages pi
    """)
    List<Product> findAllWithCertificates();


}
