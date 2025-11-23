package com.example.backend.service.impl;

import com.example.backend.domain.Category;
import com.example.backend.domain.request.ReqCategory;
import com.example.backend.domain.request.ReqCategoryDTO;
import com.example.backend.domain.response.ResCategoryDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.mapper.CategoryMapper;
import com.example.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    public ResultPaginationDTO getAllCategories(Specification<Category> spec, Pageable pageable) {

        Page<Category> pageCategory = categoryRepository.findAll(spec, pageable);

        // Map sang DTO
        Page<ResCategoryDTO> pageCategoryDto = pageCategory.map(categoryMapper::toResCategoryDTO);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageCategory.getTotalPages());
        meta.setTotal(pageCategory.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageCategoryDto.getContent());

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

    public Category handleUpdateCategory(Long id, ReqCategory req) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(req.getName());
        if(req.getSlug() != null){
            category.setSlug(req.getSlug());
        }
        if (req.getParentId() != null) {
            Category parent = categoryRepository.findById(req.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));

            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null); // nếu muốn remove cha
        }

        return categoryRepository.save(category);
    }

    public String handleDeleteCategory(Long id){
        this.categoryRepository.deleteById(id);
        return "Delete success";
    }
    public List<Category> getAllParentCategories() {
        return categoryRepository.findByParentCategoryIsNull();
    }
}
