package com.example.backend.service.impl;

import com.example.backend.domain.Category;
import com.example.backend.domain.Product;
import com.example.backend.domain.request.ReqProductDTO;
import com.example.backend.domain.response.ResGetAllProductDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResProductDTO;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          ProductMapper productMapper){
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }



    public ResGetAllProductDTO handleGetProductById(Long id) {
        Product product = this.productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return this.productMapper.toResProductDto(product);
    }

    public ResProductDTO createProduct(ReqProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = productMapper.toEntity(dto);
        product.setCategory(category);
        this.productRepository.save(product);

        return this.productMapper.toBaseResProductDto(product);

    }

    public ResultPaginationDTO getAllProducts(Specification<Product> spec, Pageable pageable) {

        Page<ResGetAllProductDTO> pageProduct = productRepository
                .findAll(spec, pageable)
                .map(productMapper::toResProductDto);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageProduct.getTotalPages());
        meta.setTotal(pageProduct.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageProduct.getContent());

        return rs;
    }




    public ResProductDTO handleUpdateProduct(Long id, ReqProductDTO updatedProduct) {

        Product existingProduct = this.productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));


        existingProduct.setName(updatedProduct.getName());
        existingProduct.setUnit(updatedProduct.getUnit());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setOrigin_address(updatedProduct.getOrigin_address());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setActive(updatedProduct.isActive());
        existingProduct.setUpdateAt(Instant.now());

        if (updatedProduct.getCategoryId() != null) {
            Category category = this.categoryRepository.findById(updatedProduct.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + updatedProduct.getCategoryId()));
            existingProduct.setCategory(category);
        }


        return this.productMapper.toBaseResProductDto(this.productRepository.save(existingProduct));
    }
    public String handleDeleteProduct(Long id){
        this.productRepository.deleteById(id);
        return "Delete success";
    }



    public ResultPaginationDTO handleGetProductByCategoryId(Long categoryId, Specification<Product> spec, Pageable pageable) {


        final List<Long> categoryIdsToSearch;

        List<Category> childrenCategories = this.categoryRepository.findAllByParentCategoryId(categoryId);

        if (childrenCategories.isEmpty()) {
            // Gán lần đầu tiên (và duy nhất)
            // Dùng List.of() để tạo nhanh một list chỉ chứa 1 phần tử (ID cha)
            categoryIdsToSearch = List.of(categoryId);
        } else {
            // Gán lần đầu tiên (và duy nhất)
            categoryIdsToSearch = childrenCategories.stream()
                    .map(Category::getId)
                    .collect(Collectors.toList());


        }


        // 2. Tạo Specification cho category (Giữ nguyên)
        Specification<Product> categorySpec = (root, query, cb) -> {
            return root.get("category").get("id").in(categoryIdsToSearch);
        };


        // 3. Kết hợp 2 Specification
        // Bắt đầu với categorySpec (luôn luôn tồn tại)
        Specification<Product> finalSpec = categorySpec;

        // Chỉ kết hợp 'spec' (từ filter) nếu nó không null
        if (spec != null) {
            finalSpec = finalSpec.and(spec);
        }

        // 4. Gọi hàm findAll() với spec cuối cùng
        Page<ResProductDTO> pageProduct = this.productRepository
                .findAll(finalSpec, pageable) // Dùng 'finalSpec' đã kết hợp
                .map(productMapper::toBaseResProductDto);

        // 5. Logic tạo Meta/ResultPaginationDTO (Giữ nguyên)
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(pageProduct.getTotalPages());
        meta.setTotal(pageProduct.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageProduct.getContent());

        return rs;
    }
}
