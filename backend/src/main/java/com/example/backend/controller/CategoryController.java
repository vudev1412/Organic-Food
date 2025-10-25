package com.example.backend.controller;

import com.example.backend.domain.Category;
import com.example.backend.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategory(){
        return ResponseEntity.ok().body(this.categoryService.handleGetAllCategory());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Optional<Category>> getCategoryById(@PathVariable Long id){
        return ResponseEntity.ok().body(this.categoryService.handleGetCategoryById(id));
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.categoryService.handleCreateCategory(category));
    }
    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category){
        return ResponseEntity.ok().body(this.categoryService.handleUpdateCategory(category,id));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id){
        return ResponseEntity.ok().body(this.categoryService.handleDeleteCategory(id));
    }
}
