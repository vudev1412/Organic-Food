package com.example.backend.controller;

import com.example.backend.domain.ProductDTO;
import com.example.backend.domain.ProductWithPromotionDTO;
import com.example.backend.domain.PromotionDTO;
import com.example.backend.domain.request.ReqPromotionDTO;
import com.example.backend.domain.response.ResPromotionDTO;
import com.example.backend.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<List<ResPromotionDTO>> getAll() {
        return ResponseEntity.ok(promotionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResPromotionDTO> getById(@PathVariable long id) {
        return ResponseEntity.ok(promotionService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ResPromotionDTO> create(@RequestBody ReqPromotionDTO dto) {
        return ResponseEntity.ok(promotionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResPromotionDTO> update(@PathVariable long id, @RequestBody ReqPromotionDTO dto) {
        return ResponseEntity.ok(promotionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        promotionService.delete(id);
        return ResponseEntity.noContent().build();
    }
    // API 1: Lấy danh sách promotion còn active
    @GetMapping("/active")
    public List<PromotionDTO> getActivePromotions() {
        return promotionService.getActivePromotions();
    }

    // API 2: Lấy danh sách product trong promotion
    @GetMapping("/{promotionId}/products")
    public List<ProductWithPromotionDTO> getProductsByPromotion(@PathVariable Long promotionId) {
        return promotionService.getProductsByPromotionId(promotionId);
    }
}
