package com.example.backend.repository;

import com.example.backend.domain.Category;
import com.example.backend.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category>
{
    List<Category> findAllByParentCategoryId(Long parentId);
}
