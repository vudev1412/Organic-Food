package com.example.backend.service;

import com.example.backend.domain.Category;
import com.example.backend.repository.CategoryRepository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    public List<Category> handleGetAllCategory(){
        return this.categoryRepository.findAll();
    }

    public Optional<Category> handleGetCategoryById(Long id){
        return this.categoryRepository.findById(id);
    }

    public Category handleCreateCategory(Category category){
        return this.categoryRepository.save(category);
    }

    public Category handleUpdateCategory(Category category, Long id){
        Optional<Category> myCate = this.handleGetCategoryById(id);
        if(myCate.isPresent()){
            Category cateCurr = myCate.get();
            cateCurr.setName(category.getName());

            this.categoryRepository.save(cateCurr);
            return  cateCurr;
        }
        return null;
    }

    public String handleDeleteCategory(Long id){
        this.categoryRepository.deleteById(id);
        return "Delete success";
    }
}
