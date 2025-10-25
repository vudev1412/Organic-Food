package com.example.backend.service;

import com.example.backend.domain.Category;
import com.example.backend.domain.Product;
import com.example.backend.domain.request.ReqProductDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ResProductDTO;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

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



    public Optional<Product> handleGetProductById(Long id){
        return this.productRepository.findById(id);
    }

    public ResProductDTO createProduct(ReqProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = productMapper.toEntity(dto);
        this.productRepository.save(product);

        return this.productMapper.toResProductDto(product);

    }

    public ResultPaginationDTO getAllProducts(Specification<Product> sepc, Pageable pageable) {
        Page<ResProductDTO> pageProduct = productRepository.findAll(sepc,pageable).map(productMapper::toResProductDto);
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

    private ResProductDTO mapToResponseDTO(Product product) {
        ResProductDTO dto = new ResProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setUnit(product.getUnit());
        dto.setPrice(product.getPrice());
        dto.setOrigin_address(product.getOrigin_address());
        dto.setDescription(product.getDescription());

        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        return dto;
    }


    public Product handleUpdateProduct(Long id, Product product){
        Optional<Product> myProduct = this.handleGetProductById(id);
        if(myProduct.isPresent()){
            Product productCurr = myProduct.get();
            productCurr.setName(product.getName());
            productCurr.setUnit(product.getUnit());
            productCurr.setPrice(product.getPrice());
            productCurr.setOrigin_address(product.getOrigin_address());
            productCurr.setDescription(product.getDescription());
            if(product.getCategory() != null){
                Long categoryId = product.getCategory().getId();
                Category category = this.categoryRepository.findById(categoryId)
                                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
                productCurr.setCategory(category);
            }
            this.productRepository.save(productCurr);
            return productCurr;
        }
        return null;
    }
    public String handleDeleteProduct(Long id){
        this.productRepository.deleteById(id);
        return "Delete success";
    }
}
