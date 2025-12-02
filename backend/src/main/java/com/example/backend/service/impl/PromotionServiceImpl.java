package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.request.ReqPromotionDTO;
import com.example.backend.domain.response.ResPromotionDTO;
import com.example.backend.mapper.PromotionMapper;
import com.example.backend.repository.PromotionDetailRepository;
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

    private final PromotionDetailRepository promotionDetailRepository;
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
    @Override
    // Lấy danh sách promotion còn active dưới dạng DTO
    public List<PromotionDTO> getActivePromotions() {
        return promotionRepository.findByActiveTrue()
                .stream()
                .map(p -> new PromotionDTO(
                        p.getId(),
                        p.getName(),
                        p.getType().name(),
                        p.getValue()
                ))
                .collect(Collectors.toList());
    }
    @Override
    // Lấy danh sách sản phẩm trong 1 promotion dưới dạng DTO
    public List<ProductWithPromotionDTO> getProductsByPromotionId(Long promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        return promotionDetailRepository.findByPromotion(promotion)
                .stream()
                .map(pd -> {
                    Product p = pd.getProduct();
                    return new ProductWithPromotionDTO(
                            p.getId(),
                            p.getName(),
                            p.getPrice(),
                            p.getSlug(),
                            p.getImage(),
                            p.getQuantity(),
                            promotion.getType().name(),
                            promotion.getValue(),
                            pd.getStartDate(),
                            pd.getEndDate()
                    );
                })
                .collect(Collectors.toList());
    }

}
