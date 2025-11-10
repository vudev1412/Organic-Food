package com.example.backend.service.impl;

import com.example.backend.domain.Promotion;
import com.example.backend.domain.request.ReqPromotionDTO;
import com.example.backend.domain.response.ResPromotionDTO;
import com.example.backend.mapper.PromotionMapper;
import com.example.backend.repository.PromotionRepository;
import com.example.backend.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    @Override
    public List<ResPromotionDTO> getAll() {
        return promotionRepository.findAll()
                .stream()
                .map(promotionMapper::toResPromotionDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResPromotionDTO getById(long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        return promotionMapper.toResPromotionDTO(promotion);
    }

    @Override
    public ResPromotionDTO create(ReqPromotionDTO dto) {
        Promotion promotion = promotionMapper.toPromotion(dto);
        Promotion saved = promotionRepository.save(promotion);
        return promotionMapper.toResPromotionDTO(saved);
    }

    @Override
    public ResPromotionDTO update(long id, ReqPromotionDTO dto) {
        Promotion existing = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        promotionMapper.updatePromotionFromDTO(dto, existing);
        Promotion updated = promotionRepository.save(existing);
        return promotionMapper.toResPromotionDTO(updated);
    }

    @Override
    public void delete(long id) {
        promotionRepository.deleteById(id);
    }
}
