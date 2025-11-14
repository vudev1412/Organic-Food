package com.example.backend.service.impl;

import com.example.backend.domain.Product;
import com.example.backend.domain.Promotion;
import com.example.backend.domain.PromotionDetail;
import com.example.backend.domain.key.PromotionDetailKey;
import com.example.backend.domain.request.ReqPromotionDetailDTO;
import com.example.backend.domain.response.ResPromotionDetailDTO;
import com.example.backend.mapper.PromotionDetailMapper;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.PromotionDetailRepository;
import com.example.backend.repository.PromotionRepository;
import com.example.backend.service.PromotionDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionDetailServiceImpl implements PromotionDetailService {

    private final PromotionDetailRepository promotionDetailRepository;
    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final PromotionDetailMapper mapper;

    @Override
    public List<ResPromotionDetailDTO> getAll() {
        return promotionDetailRepository.findAll()
                .stream()
                .map(mapper::toResPromotionDetailDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResPromotionDetailDTO create(ReqPromotionDetailDTO dto) {
        Promotion promotion = promotionRepository.findById(dto.getPromotionId())
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        PromotionDetail entity = mapper.toEntity(dto);
        entity.setPromotion(promotion);
        entity.setProduct(product);

        PromotionDetailKey key = new PromotionDetailKey();
        key.setPromotionId(dto.getPromotionId());
        key.setProductId(dto.getProductId());
        entity.setId(key);

        PromotionDetail saved = promotionDetailRepository.save(entity);
        return mapper.toResPromotionDetailDTO(saved);
    }

    @Override
    public ResPromotionDetailDTO update(long promotionId, long productId, ReqPromotionDetailDTO dto) {
        PromotionDetailKey key = new PromotionDetailKey(promotionId, productId);
        PromotionDetail existing = promotionDetailRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("PromotionDetail not found"));
        mapper.updateFromDTO(dto, existing);
        PromotionDetail updated = promotionDetailRepository.save(existing);
        return mapper.toResPromotionDetailDTO(updated);
    }

    @Override
    public void delete(long promotionId, long productId) {
        PromotionDetailKey key = new PromotionDetailKey(promotionId, productId);
        promotionDetailRepository.deleteById(key);
    }

    @Override
    public ResPromotionDetailDTO getById(long promotionId, long productId) {
        PromotionDetailKey key = new PromotionDetailKey(promotionId, productId);
        PromotionDetail existing = promotionDetailRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("PromotionDetail not found"));
        return this.mapper.toResPromotionDetailDTO(existing);
    }


}
