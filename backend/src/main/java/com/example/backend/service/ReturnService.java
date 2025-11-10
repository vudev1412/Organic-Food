package com.example.backend.service;

import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.response.ResReturnDTO;

import java.util.List;

public interface ReturnService {
    List<ResReturnDTO> getAllReturns();
    ResReturnDTO getReturnById(Long id);
    ResReturnDTO createReturn(ReqReturnDTO dto);
    ResReturnDTO updateReturn(Long id, ReqReturnDTO dto);
    void deleteReturn(Long id);
}
