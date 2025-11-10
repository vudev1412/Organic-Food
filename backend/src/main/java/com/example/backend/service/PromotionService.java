package com.example.backend.service;

import com.example.backend.domain.request.ReqPromotionDTO;
import com.example.backend.domain.response.ResPromotionDTO;

import java.util.List;

public interface PromotionService {
    List<ResPromotionDTO> getAll();
    ResPromotionDTO getById(long id);
    ResPromotionDTO create(ReqPromotionDTO dto);
    ResPromotionDTO update(long id, ReqPromotionDTO dto);
    void delete(long id);
}
