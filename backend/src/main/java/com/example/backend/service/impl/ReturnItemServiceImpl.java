package com.example.backend.service.impl;

import com.example.backend.domain.Product;
import com.example.backend.domain.Return;
import com.example.backend.domain.ReturnItem;
import com.example.backend.domain.request.ReqReturnItemDTO;
import com.example.backend.domain.response.ResReturnItemDTO;
import com.example.backend.mapper.ReturnItemMapper;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReturnItemRepository;
import com.example.backend.repository.ReturnRepository;
import com.example.backend.service.ReturnItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReturnItemServiceImpl implements ReturnItemService {

    private final ReturnItemRepository returnItemRepository;
    private final ReturnRepository returnRepository;
    private final ProductRepository productRepository;
    private final ReturnItemMapper returnItemMapper;

    @Override
    public List<ResReturnItemDTO> getAllReturnItems() {
        return returnItemRepository.findAll()
                .stream()
                .map(returnItemMapper::toResReturnItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResReturnItemDTO getReturnItemById(Long id) {
        ReturnItem ri = returnItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReturnItem not found"));
        return returnItemMapper.toResReturnItemDTO(ri);
    }

    @Override
    public ResReturnItemDTO createReturnItem(ReqReturnItemDTO dto) {
        ReturnItem ri = returnItemMapper.toEntity(dto);

        Return r = returnRepository.findById(dto.getReturnId())
                .orElseThrow(() -> new RuntimeException("Return not found"));
        Product p = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ri.setReturns(r);
        ri.setProduct(p);

        ReturnItem saved = returnItemRepository.save(ri);
        return returnItemMapper.toResReturnItemDTO(saved);
    }

    @Override
    public ResReturnItemDTO updateReturnItem(Long id, ReqReturnItemDTO dto) {
        ReturnItem ri = returnItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReturnItem not found"));

        if(dto.getQuantity() > 0) ri.setQuantity(dto.getQuantity());
        if(dto.getAmountRefund() > 0) ri.setAmountRefund(dto.getAmountRefund());
        if(dto.getNote() != null) ri.setNote(dto.getNote());
        if(dto.getCreatedAt() != null) ri.setCreatedAt(dto.getCreatedAt());

        if(dto.getReturnId() > 0) {
            Return r = returnRepository.findById(dto.getReturnId())
                    .orElseThrow(() -> new RuntimeException("Return not found"));
            ri.setReturns(r);
        }
        if(dto.getProductId() > 0) {
            Product p = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            ri.setProduct(p);
        }

        ReturnItem updated = returnItemRepository.save(ri);
        return returnItemMapper.toResReturnItemDTO(updated);
    }

    @Override
    public void deleteReturnItem(Long id) {
        returnItemRepository.deleteById(id);
    }
}
