package com.example.backend.service;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqCreateReceiptDTO;
import com.example.backend.domain.response.ResReceiptDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface ReceiptService {
    ResReceiptDTO handleCreateReceipt(ReqCreateReceiptDTO receipt);
    ResultPaginationDTO handleGetAllReceipts(Specification<Receipt> spec, Pageable pageable);
    ResReceiptDTO handleGetReceiptById(Long id);
    ResReceiptDTO handleUpdateReceipt(Long id, ReqCreateReceiptDTO request);
    void deleteReceipt(Long id);

}
