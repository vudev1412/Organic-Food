package com.example.backend.service;

import com.example.backend.domain.*;
import com.example.backend.domain.request.ReqCreatePromotionDTO;
import com.example.backend.domain.request.ReqPromotionDTO;
import com.example.backend.domain.response.ResPromotionDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface PromotionService {
    ResultPaginationDTO getAll(Specification<Promotion> spec, Pageable pageable);
    ResPromotionDTO getById(long id);
    ResPromotionDTO create(ReqCreatePromotionDTO dto);
    ResPromotionDTO update(long id, ReqPromotionDTO dto);
    void delete(long id);
    List<PromotionDTO> getActivePromotions();
    List<ProductWithPromotionDTO> getProductsByPromotionId(Long promotionId);
}
