package com.example.backend.service.impl;

import com.example.backend.domain.Order;
import com.example.backend.domain.Return;
import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.response.ResReturnDTO;
import com.example.backend.mapper.ReturnMapper;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ReturnRepository;
import com.example.backend.service.ReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReturnServiceImpl implements ReturnService {

    private final ReturnRepository returnRepository;
    private final OrderRepository orderRepository;
    private final ReturnMapper returnMapper;

    @Override
    public List<ResReturnDTO> getAllReturns() {
        return returnRepository.findAll()
                .stream()
                .map(returnMapper::toResReturnDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResReturnDTO getReturnById(Long id) {
        Return r = returnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Return not found"));
        return returnMapper.toResReturnDTO(r);
    }

    @Override
    public ResReturnDTO createReturn(ReqReturnDTO dto) {
        Return r = returnMapper.toEntity(dto);
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        r.setOrder(order);

        Return saved = returnRepository.save(r);
        return returnMapper.toResReturnDTO(saved);
    }

    @Override
    public ResReturnDTO updateReturn(Long id, ReqReturnDTO dto) {
        Return r = returnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Return not found"));

        if(dto.getReason() != null) r.setReason(dto.getReason());
        if(dto.getStatus() != null) r.setStatus(dto.getStatus());
        if(dto.getReturnType() != null) r.setReturnType(dto.getReturnType());
        if(dto.getCreatedAt() != null) r.setCreatedAt(dto.getCreatedAt());
        if(dto.getApprovedAt() != null) r.setApprovedAt(dto.getApprovedAt());
        r.setProcessedBy(dto.getProcessedBy());
        if(dto.getProcessNote() != null) r.setProcessNote(dto.getProcessNote());
        if(dto.getOrderId() > 0) {
            Order order = orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            r.setOrder(order);
        }

        Return updated = returnRepository.save(r);
        return returnMapper.toResReturnDTO(updated);
    }

    @Override
    public void deleteReturn(Long id) {
        returnRepository.deleteById(id);
    }
}
