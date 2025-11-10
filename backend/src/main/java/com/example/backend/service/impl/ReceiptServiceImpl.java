package com.example.backend.service.impl;

import com.example.backend.domain.Receipt;
import com.example.backend.domain.response.ResReceiptDTO;
import com.example.backend.mapper.ReceiptMapper;
import com.example.backend.repository.ReceiptRepository;
import com.example.backend.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptMapper receiptMapper;

    @Override
    public Receipt handleCreateReceipt(Receipt receipt) {
        return receiptRepository.save(receipt);
    }

    @Override
    public List<ResReceiptDTO> handleGetAllReceipts() {
        return receiptRepository.findAll().stream()
                .map(receiptMapper::toResReceiptDTO)
                .toList();
    }

    @Override
    public ResReceiptDTO handleGetReceiptById(Long id) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));
        return receiptMapper.toResReceiptDTO(receipt);
    }

    @Override
    public ResReceiptDTO handleUpdateReceipt(Long id, Receipt receipt) {
        Receipt currentReceipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));

        if (receipt.getShipDate() != null) currentReceipt.setShipDate(receipt.getShipDate());
        if (receipt.getDeliverName() != null) currentReceipt.setDeliverName(receipt.getDeliverName());
        if (receipt.getDiscount() >= 0) currentReceipt.setDiscount(receipt.getDiscount());
        if (receipt.getTotalAmount() > 0) currentReceipt.setTotalAmount(receipt.getTotalAmount());
        if (receipt.getStatus() != null) currentReceipt.setStatus(receipt.getStatus());
        if (receipt.getCreatedAt() != null) currentReceipt.setCreatedAt(receipt.getCreatedAt());

        receiptRepository.save(currentReceipt);

        return receiptMapper.toResReceiptDTO(currentReceipt);
    }

    @Override
    public void handleDeleteReceipt(Long id) {
        receiptRepository.deleteById(id);
    }
}
