package com.example.backend.controller;

import com.example.backend.domain.Category;
import com.example.backend.domain.Product;
import com.example.backend.domain.request.ReqCategory;
import com.example.backend.domain.request.ReqCategoryDTO;
import com.example.backend.domain.response.ResCategoryDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.service.impl.CategoryService;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public ResponseEntity<ResultPaginationDTO> getAllCategory( @Filter Specification<Category> spec,
                                                               Pageable pageable){
        return ResponseEntity.ok().body(this.categoryService.getAllCategories(spec, pageable));
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id){
        return ResponseEntity.ok().body(this.categoryService.handleGetCategoryById(id));
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QLKho') or hasAuthority('QL LoaiSP')")
    public ResponseEntity<Category> createCategory(@RequestBody ReqCategoryDTO category){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.categoryService.handleCreateCategory(category));
    }
    @PutMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QLKho') or hasAuthority('QL LoaiSP')")
    public ResponseEntity<ResCategoryDTO> updateCategory(@PathVariable Long id, @RequestBody ReqCategory category){
        return ResponseEntity.ok().body(this.categoryService.handleUpdateCategory(id,category));
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('QLKho') or hasAuthority('QL LoaiSP')")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id){
        return ResponseEntity.ok().body(this.categoryService.handleDeleteCategory(id));
    }
    @GetMapping("/categories/parents")
    public ResponseEntity<List<Category>> getParentCategories() {
        return ResponseEntity.ok(categoryService.getAllParentCategories());
    }
}
