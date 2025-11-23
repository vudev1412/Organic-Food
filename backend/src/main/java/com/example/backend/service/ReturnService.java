package com.example.backend.service;

import com.example.backend.domain.Return;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.response.ResReturnDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface ReturnService {
    ResultPaginationDTO getAllReturns(String keyword, Pageable pageable);
    ResReturnDTO getReturnById(Long id);
    ResReturnDTO createReturn(ReqReturnDTO dto);
    ResReturnDTO updateReturn(Long id, ReqReturnDTO dto);
    void deleteReturn(Long id);
}
