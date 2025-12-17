package com.example.backend.service.impl;

import com.example.backend.domain.*;
import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.request.ReturnRequestDTO;
import com.example.backend.domain.response.*;
import com.example.backend.enums.StatusReturn;
import com.example.backend.enums.TypeReturn;
import com.example.backend.mapper.ReturnMapper;
import com.example.backend.repository.*;
import com.example.backend.service.ReturnService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReturnServiceImpl implements ReturnService {

    private final ReturnRepository returnRepository;
    private final OrderRepository orderRepository;
    private final ReturnMapper returnMapper;
    private final ProductRepository productRepository;
    private final ReturnItemRepository returnItemRepository;
    private final ReturnImageRepository returnImageRepository;
    private ReturnResponseDTO convertToResponse(Return r) {
        ReturnResponseDTO dto = new ReturnResponseDTO();
        dto.setId(r.getId());
        dto.setReason(r.getReason());
        dto.setStatus(r.getStatus().name());
        dto.setReturnType(r.getReturnType().name());
        dto.setCreatedAt(r.getCreatedAt());

        // Map ReturnItems
        List<ReturnItemResponseDTO> items = r.getReturnItems().stream().map(i -> {
            ReturnItemResponseDTO x = new ReturnItemResponseDTO();
            x.setId(i.getId());
            x.setProductId(i.getProduct().getId());
            x.setProductName(i.getProduct().getName());
            x.setProductImage(i.getProduct().getImage()); // hoặc image khác nếu có
            x.setQuantity(i.getQuantity());
            x.setNote(i.getNote());
            return x;
        }).toList();
        dto.setItems(items);

        // Map ReturnImages
        List<ImageDTO> images = r.getReturnImages().stream().map(img -> {
            ImageDTO imgDTO = new ImageDTO();
            imgDTO.setId(img.getId());
            imgDTO.setUrl(img.getImageUrl());
            return imgDTO;
        }).toList();
        dto.setImageUrls(images);

        return dto;
    }


    @Override
    public ResultPaginationDTO getAllReturns(  Specification<Return> spec,
                                               Pageable pageable) {
        Page<ResGetAllReturnDTO> pageReturn =
                returnRepository
                        .findAll(spec, pageable)
                        .map(returnMapper::toResGetAllReturnDTO);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageReturn.getTotalPages());
        meta.setTotal(pageReturn.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageReturn.getContent());

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
    @Override
    public ReturnResponseDTO createReturn(ReturnRequestDTO request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Kiểm tra xem order đã có return chưa
        List<Return> existingReturns = returnRepository.findByOrderId(order.getId());
        if (!existingReturns.isEmpty()) {
            throw new RuntimeException("Đơn hàng này đã có yêu cầu đổi/trả");
        }

        // Tạo Return mới (như trước)
        Return returns = new Return();
        returns.setOrder(order);
        returns.setReason(request.getReason());
        returns.setReturnType(TypeReturn.valueOf(request.getReturnType()));
        returns.setStatus(StatusReturn.PENDING);
        returns.setCreatedAt(Instant.now());
        returnRepository.save(returns);

        // Tạo Return Items
        List<ReturnItem> items = new ArrayList<>();
        for (ReturnItemDTO i : request.getItems()) {
            Product product = productRepository.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            ReturnItem item = new ReturnItem();
            item.setProduct(product);
            item.setQuantity(i.getQuantity());
            item.setNote(i.getNote());
            item.setCreatedAt(Instant.now());
            item.setReturns(returns);

            returnItemRepository.save(item);
            items.add(item);
        }
        returns.setReturnItems(items);

        // Tạo Return Images
        List<ReturnImage> images = new ArrayList<>();
        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                ReturnImage img = new ReturnImage();
                img.setImageUrl(url);
                img.setUploadedAt(Instant.now());
                img.setReturns(returns);
                returnImageRepository.save(img);
                images.add(img);
            }
        }
        returns.setReturnImages(images);

        return convertToResponse(returns);
    }
    @Override
    public List<ReturnResponseDTO> getReturnsByUserId(Long userId) {
        // Lấy tất cả returns của các order thuộc user này
        List<Return> returns = returnRepository.findAllByOrderUserId(userId);
        return returns.stream().map(this::convertToResponse).toList();
    }

    @Override
    public boolean isOrderBelongToUser(Long orderId, Long userId) {
        return orderRepository.findById(orderId)
                .map(order -> order.getUser().getId() == userId)
                .orElse(false);
    }
    @Override
    public ReturnResponseDTO getReturnByIdForCustomer(Long returnId, Long userId) {
        Return returns = returnRepository.findById(returnId)
                .orElseThrow(() -> new RuntimeException("Return not found"));

        // Kiểm tra đơn hàng có thuộc user này không
        if (!returns.getOrder().getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền truy cập return này");
        }

        // Chuyển sang DTO để trả về FE
        return convertToResponse(returns);
    }

    @Override
    public Map<String, Object> checkReturnRequest(Long orderId) {

        Optional<Return> existingReturn = returnRepository.findByOrder_Id(orderId);

        Map<String, Object> result = new HashMap<>();

        if (existingReturn.isPresent()) {
            Return r = existingReturn.get();

            result.put("hasReturnRequest", true);
            result.put("returnId", r.getId());
            result.put("status", r.getStatus().name());
            result.put("returnType", r.getReturnType().name());
            result.put("createdAt", r.getCreatedAt());
            result.put("message", "Đơn hàng đã có yêu cầu khiếu nại/đổi trả.");
        } else {
            result.put("hasReturnRequest", false);
            result.put("message", "Đơn hàng chưa có yêu cầu khiếu nại/đổi trả.");
        }

        return result;
    }
}
