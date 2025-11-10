package com.example.backend.service;

import com.example.backend.domain.request.ReqReceiptDetailDTO;
import com.example.backend.domain.response.ResReceiptDetailDTO;

import java.util.List;

public interface ReceiptDetailService {
    List<ResReceiptDetailDTO> getAll();
    ResReceiptDetailDTO create(ReqReceiptDetailDTO dto);
    ResReceiptDetailDTO update(long receiptId, long productId, ReqReceiptDetailDTO dto);
    void delete(long receiptId, long productId);
}
