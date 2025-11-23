package com.example.backend.service;

import com.example.backend.domain.PromotionDetail;
import com.example.backend.domain.request.ReqPromotionDetailDTO;
import com.example.backend.domain.response.BestPromotionDTO;
import com.example.backend.domain.response.ResPromotionDetailDTO;

import java.util.List;
import java.util.Optional;

public interface PromotionDetailService {
    List<ResPromotionDetailDTO> getAll();
    ResPromotionDetailDTO create(ReqPromotionDetailDTO dto);
    ResPromotionDetailDTO update(long promotionId, long productId, ReqPromotionDetailDTO dto);
    void delete(long promotionId, long productId);
    ResPromotionDetailDTO getById(long promotionId, long productId);
    List<ResPromotionDetailDTO> handleGetByProductId(Long productId);
    List<ResPromotionDetailDTO> handleGetByPromotionId(Long promotionId);
    Optional<BestPromotionDTO> findBestActivePromotion(Long productId);
}
