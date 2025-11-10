package com.example.backend.service;

import com.example.backend.domain.request.ReqPromotionDetailDTO;
import com.example.backend.domain.response.ResPromotionDetailDTO;

import java.util.List;

public interface PromotionDetailService {
    List<ResPromotionDetailDTO> getAll();
    ResPromotionDetailDTO create(ReqPromotionDetailDTO dto);
    ResPromotionDetailDTO update(long promotionId, long productId, ReqPromotionDetailDTO dto);
    void delete(long promotionId, long productId);
}
