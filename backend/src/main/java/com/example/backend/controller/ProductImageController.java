package com.example.backend.controller;

import com.example.backend.domain.ProductImage;
import com.example.backend.domain.request.ReqProductImage;
import com.example.backend.domain.response.ResProductImage;
import com.example.backend.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ProductImageController {

    private final ProductImageService productImageService;

    @PostMapping("/product-images")
    public ResponseEntity<ResProductImage> createProductImage(@RequestBody ReqProductImage req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productImageService.createProductImage(req));
    }

    @GetMapping("/product-images")
    public ResponseEntity<List<ResProductImage>> getAllProductImages() {
        return ResponseEntity.ok(productImageService.getAllProductImages());
    }

    @GetMapping("/product-images/{id}")
    public ResponseEntity<ResProductImage> getProductImageById(@PathVariable Long id) {
        return ResponseEntity.ok(productImageService.getProductImageById(id));
    }

    @PatchMapping("/product-images/{id}")
    public ResponseEntity<ResProductImage> updateProductImage(
            @PathVariable Long id,
            @RequestBody ProductImage productImage) {
        return ResponseEntity.ok(productImageService.updateProductImage(id, productImage));
    }

    @DeleteMapping("/product-images/{id}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long id) {
        productImageService.deleteProductImage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product-images/product/{productId}")
    public ResponseEntity<List<ResProductImage>> getImagesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.getImagesProductById(productId));
    }
}
