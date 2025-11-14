package com.example.backend.service.impl;

import com.example.backend.domain.Category;
import com.example.backend.domain.request.ReqCategoryDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    public ResultPaginationDTO getAllCategories(Specification<Category> spec, Pageable pageable) {
        // Sử dụng repository với Specification + Pageable
        Page<Category> pageCategory = categoryRepository.findAll(spec, pageable);

        // Nếu cần map sang DTO, bạn có thể tạo mapper tương tự Product
        // Ví dụ: Page<ResCategoryDTO> pageCategoryDto = pageCategory.map(categoryMapper::toResCategoryDto);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageCategory.getTotalPages());
        meta.setTotal(pageCategory.getTotalElements());

        // rs.setResult(pageCategoryDto.getContent()); // nếu dùng DTO
        rs.setResult(pageCategory.getContent()); // nếu trả về entity trực tiếp

        rs.setMeta(meta);
        return rs;
    }

    public Category handleGetCategoryById(Long id){
        return this.categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id:"+ id));
    }

    public Category handleCreateCategory(ReqCategoryDTO dto){

        Category category = new Category();
        category.setName(dto.getName());
        category.setSlug(dto.getSlug());

        if (dto.getParentCategoryId() != null) {
            Category parent = categoryRepository.findById(dto.getParentCategoryId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParentCategory(parent);
        }

        return categoryRepository.save(category);
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
