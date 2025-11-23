package com.example.backend.service.impl;

import com.example.backend.domain.Order;
import com.example.backend.domain.Return;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.response.ResReturnDTO;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.mapper.ReturnMapper;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ReturnRepository;
import com.example.backend.service.ReturnService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReturnServiceImpl implements ReturnService {

    private final ReturnRepository returnRepository;
    private final OrderRepository orderRepository;
    private final ReturnMapper returnMapper;

    @Override
    public ResultPaginationDTO getAllReturns(String keyword, Pageable pageable) {
        // Tạo Specification dynamic
        Specification<Return> spec = (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction(); // không filter
            }

            // Join tới order
            Join<Return, Order> orderJoin = root.join("order", JoinType.LEFT);

            // Join tới user nếu cần tìm theo tên khách hàng
            Join<Order, User> userJoin = orderJoin.join("user", JoinType.LEFT);

            // List các điều kiện
            List<Predicate> predicates = new ArrayList<>();

            // Tìm theo tên khách hàng
            predicates.add(cb.like(cb.lower(userJoin.get("name")), "%" + keyword.toLowerCase() + "%"));

            // Thử parse orderId nếu keyword là số
            try {
                Long orderId = Long.parseLong(keyword);
                predicates.add(cb.equal(orderJoin.get("id"), orderId));
            } catch (NumberFormatException e) {
                // Nếu không phải số thì bỏ qua điều kiện orderId
            }

            // Kết hợp các điều kiện bằng OR
            return cb.or(predicates.toArray(new Predicate[0]));
        };

        // Lấy dữ liệu
        Page<Return> pageReturn = returnRepository.findAll(spec, pageable);

        // Mapping sang DTO
        List<ResReturnDTO> list = pageReturn.getContent()
                .stream()
                .map(returnMapper::toResReturnDTO)
                .collect(Collectors.toList());

        // Build result
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageReturn.getTotalPages());
        meta.setTotal(pageReturn.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(list);

        return rs;
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

        if (dto.getReason() != null) r.setReason(dto.getReason());
        if (dto.getStatus() != null) r.setStatus(dto.getStatus());
        if (dto.getReturnType() != null) r.setReturnType(dto.getReturnType());
        if (dto.getCreatedAt() != null) r.setCreatedAt(dto.getCreatedAt());
        if (dto.getApprovedAt() != null) r.setApprovedAt(dto.getApprovedAt());
        r.setProcessedBy(dto.getProcessedBy());
        if (dto.getProcessNote() != null) r.setProcessNote(dto.getProcessNote());

        if (dto.getOrderId() != null && dto.getOrderId() > 0) {
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
