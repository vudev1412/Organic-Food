package com.example.backend.service.impl;

import com.example.backend.domain.Category;
import com.example.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    public List<Category> handleGetAllCategory(){
        return this.categoryRepository.findAll();
    }

    public Category handleGetCategoryById(Long id){
        return this.categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id:"+ id));
    }

    public Category handleCreateCategory(Category category){
        return this.categoryRepository.save(category);
    }

    public Category handleUpdateCategory(Long id, Category updatedCategory) {

        Category existingCategory = this.categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));


        existingCategory.setName(updatedCategory.getName());


        return this.categoryRepository.save(existingCategory);
    }

    public String handleDeleteCategory(Long id){
        this.categoryRepository.deleteById(id);
        return "Delete success";
    }
}
