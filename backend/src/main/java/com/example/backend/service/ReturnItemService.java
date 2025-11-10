package com.example.backend.service;

import com.example.backend.domain.request.ReqReturnItemDTO;
import com.example.backend.domain.response.ResReturnItemDTO;

import java.util.List;

public interface ReturnItemService {
    List<ResReturnItemDTO> getAllReturnItems();
    ResReturnItemDTO getReturnItemById(Long id);
    ResReturnItemDTO createReturnItem(ReqReturnItemDTO dto);
    ResReturnItemDTO updateReturnItem(Long id, ReqReturnItemDTO dto);
    void deleteReturnItem(Long id);
}
