package com.example.backend.service.impl;

import com.example.backend.domain.Product;
import com.example.backend.domain.Receipt;
import com.example.backend.domain.ReceiptDetail;
import com.example.backend.domain.key.ReceiptDetailKey;
import com.example.backend.domain.request.ReqReceiptDetailDTO;
import com.example.backend.domain.response.ResReceiptDetailDTO;
import com.example.backend.mapper.ReceiptDetailMapper;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReceiptDetailRepository;
import com.example.backend.repository.ReceiptRepository;
import com.example.backend.service.ReceiptDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReceiptDetailServiceImpl implements ReceiptDetailService {

    private final ReceiptDetailRepository receiptDetailRepository;
    private final ReceiptRepository receiptRepository;
    private final ProductRepository productRepository;
    private final ReceiptDetailMapper mapper;

    @Override
    public List<ResReceiptDetailDTO> getAll() {
        return receiptDetailRepository.findAll()
                .stream()
                .map(mapper::toResReceiptDetailDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResReceiptDetailDTO create(ReqReceiptDetailDTO dto) {
        Receipt receipt = receiptRepository.findById(dto.getReceiptId())
                .orElseThrow(() -> new RuntimeException("Receipt not found"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ReceiptDetail entity = mapper.toEntity(dto);
        entity.setReceipt(receipt);
        entity.setProduct(product);

        ReceiptDetailKey key = new ReceiptDetailKey(dto.getReceiptId(), dto.getProductId());
        entity.setId(key);

        ReceiptDetail saved = receiptDetailRepository.save(entity);
        return mapper.toResReceiptDetailDTO(saved);
    }

    @Override
    public ResReceiptDetailDTO update(long receiptId, long productId, ReqReceiptDetailDTO dto) {
        ReceiptDetailKey key = new ReceiptDetailKey(receiptId, productId);
        ReceiptDetail existing = receiptDetailRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("ReceiptDetail not found"));
        mapper.updateFromDTO(dto, existing);
        ReceiptDetail updated = receiptDetailRepository.save(existing);
        return mapper.toResReceiptDetailDTO(updated);
    }

    @Override
    public void delete(long receiptId, long productId) {
        ReceiptDetailKey key = new ReceiptDetailKey(receiptId, productId);
        receiptDetailRepository.deleteById(key);
    }
}
