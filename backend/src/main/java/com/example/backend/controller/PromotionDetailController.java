package com.example.backend.controller;

import com.example.backend.domain.PromotionDetail;
import com.example.backend.domain.request.ReqPromotionDetailDTO;
import com.example.backend.domain.response.ResPromotionDetailDTO;
import com.example.backend.service.PromotionDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/promotion-details")
@RequiredArgsConstructor
public class PromotionDetailController {

    private final PromotionDetailService promotionDetailService;

    @GetMapping
    public ResponseEntity<List<ResPromotionDetailDTO>> getAll() {
        return ResponseEntity.ok(promotionDetailService.getAll());
    }

    @PostMapping
    public ResponseEntity<ResPromotionDetailDTO> create(@RequestBody ReqPromotionDetailDTO dto) {
        return ResponseEntity.ok(promotionDetailService.create(dto));
    }

    @PutMapping("/{promotionId}/{productId}")
    public ResponseEntity<ResPromotionDetailDTO> update(
            @PathVariable long promotionId,
            @PathVariable long productId,
            @RequestBody ReqPromotionDetailDTO dto
    ) {
        return ResponseEntity.ok(promotionDetailService.update(promotionId, productId, dto));
    }

    @DeleteMapping("/{promotionId}/{productId}")
    public ResponseEntity<Void> delete(
            @PathVariable long promotionId,
            @PathVariable long productId
    ) {
        promotionDetailService.delete(promotionId, productId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{promotionId}/{productId}")
    public ResponseEntity<ResPromotionDetailDTO> getById(@PathVariable long promotionId,
                                                         @PathVariable long productId){
        return ResponseEntity.ok().body(this.promotionDetailService.getById(promotionId,productId));
    }
    @GetMapping("/by-product/{productId}")
    public ResponseEntity<List<ResPromotionDetailDTO>> getPromotionDetailByProductId(@PathVariable Long productId) {

        return ResponseEntity.ok().body(promotionDetailService.handleGetByProductId(productId));
    }

    @GetMapping("/by-promotion/{promotionId}")
    public ResponseEntity<List<ResPromotionDetailDTO>> getPromotionDetailByPromotionId(@PathVariable Long promotionId) {

        return ResponseEntity.ok().body(promotionDetailService.handleGetByPromotionId(promotionId));
    }


}
