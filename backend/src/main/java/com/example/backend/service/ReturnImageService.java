package com.example.backend.service;

import com.example.backend.domain.request.ReqReturnImageDTO;
import com.example.backend.domain.response.ResReturnImageDTO;

import java.util.List;

public interface ReturnImageService {
    List<ResReturnImageDTO> getAllReturnImages();
    ResReturnImageDTO getReturnImageById(Long id);
    ResReturnImageDTO createReturnImage(ReqReturnImageDTO dto);
    ResReturnImageDTO updateReturnImage(Long id, ReqReturnImageDTO dto);
    void deleteReturnImage(Long id);
}
