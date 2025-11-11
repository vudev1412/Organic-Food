package com.example.backend.service;

import com.example.backend.domain.ProductImage;
import com.example.backend.domain.request.ReqProductImage;
import com.example.backend.domain.response.ResProductImage;

import java.util.List;

public interface ProductImageService {
    ResProductImage createProductImage(ReqProductImage req);
    List<ResProductImage> getAllProductImages();
    ResProductImage getProductImageById(Long id);
    ResProductImage updateProductImage(Long id, ProductImage productImage);
    void deleteProductImage(Long id);
    List<ResProductImage> getImagesProductById(Long productId);
}
