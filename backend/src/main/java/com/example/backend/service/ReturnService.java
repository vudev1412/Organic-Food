package com.example.backend.service;

import com.example.backend.domain.Return;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.request.ReturnRequestDTO;
import com.example.backend.domain.response.ResReturnDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.domain.response.ReturnResponseDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Map;

public interface ReturnService {
    ResultPaginationDTO getAllReturns(String keyword, Pageable pageable);
    ResReturnDTO getReturnById(Long id);
    ResReturnDTO createReturn(ReqReturnDTO dto);
    ResReturnDTO updateReturn(Long id, ReqReturnDTO dto);
    void deleteReturn(Long id);
    ReturnResponseDTO createReturn(ReturnRequestDTO request);
    /**
     * Lấy danh sách return của user
     */
    List<ReturnResponseDTO> getReturnsByUserId(Long userId);

    /**
     * Kiểm tra order có thuộc về user không
     */
    boolean isOrderBelongToUser(Long orderId, Long userId);
    /**
     * Lấy chi tiết return theo id dành cho customer
     * Kiểm tra quyền sở hữu bên trong service
     */
    ReturnResponseDTO getReturnByIdForCustomer(Long returnId, Long userId);
    Map<String, Object> checkReturnRequest(Long orderId);
}
