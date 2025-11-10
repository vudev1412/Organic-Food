package com.example.backend.service;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.response.ResReceiptDTO;

import java.util.List;

public interface ReceiptService {
    Receipt handleCreateReceipt(Receipt receipt);
    List<ResReceiptDTO> handleGetAllReceipts();
    ResReceiptDTO handleGetReceiptById(Long id);
    ResReceiptDTO handleUpdateReceipt(Long id, Receipt receipt);
    void handleDeleteReceipt(Long id);
}
