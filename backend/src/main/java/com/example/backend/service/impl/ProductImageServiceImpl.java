package com.example.backend.service.impl;

import com.example.backend.domain.Product;
import com.example.backend.domain.ProductImage;
import com.example.backend.domain.request.ReqProductImage;
import com.example.backend.domain.response.ResProductImage;
import com.example.backend.mapper.ProductImageMapper;
import com.example.backend.repository.ProductImageRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final ProductImageMapper productImageMapper;

    @Override
    public ResProductImage createProductImage(ReqProductImage req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductImage image = new ProductImage();
        image.setImgUrl(req.getImgUrl());
        image.setProduct(product);

        productImageRepository.save(image);
        return productImageMapper.toResProductImage(image);
    }

    @Override
    public List<ResProductImage> getAllProductImages() {
        return productImageRepository.findAll().stream()
                .map(productImageMapper::toResProductImage)
                .toList();
    }

    @Override
    public ResProductImage getProductImageById(Long id) {
        ProductImage image = productImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductImage not found"));
        return productImageMapper.toResProductImage(image);
    }

    @Override
    public ResProductImage updateProductImage(Long id, ProductImage productImage) {
        ProductImage current = productImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductImage not found"));

        if (productImage.getImgUrl() != null) {
            current.setImgUrl(productImage.getImgUrl());
        }
        productImageRepository.save(current);
        return productImageMapper.toResProductImage(current);
    }

    @Override
    public void deleteProductImage(Long id) {
        productImageRepository.deleteById(id);
    }
}
