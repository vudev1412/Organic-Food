package com.example.backend.service.impl;

import com.example.backend.domain.Product;
import com.example.backend.domain.Promotion;
import com.example.backend.domain.PromotionDetail;
import com.example.backend.domain.key.PromotionDetailKey;
import com.example.backend.domain.request.ReqPromotionDetailDTO;
import com.example.backend.domain.response.BestPromotionDTO;
import com.example.backend.domain.response.ResPromotionDetailDTO;
import com.example.backend.enums.TypePromotion;
import com.example.backend.mapper.PromotionDetailMapper;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.PromotionDetailRepository;
import com.example.backend.repository.PromotionRepository;
import com.example.backend.service.PromotionDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionDetailServiceImpl implements PromotionDetailService {

    private final PromotionDetailRepository promotionDetailRepository;
    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final PromotionDetailMapper mapper;

    @Override
    public List<ResPromotionDetailDTO> getAll() {
        return promotionDetailRepository.findAll()
                .stream()
                .map(mapper::toResPromotionDetailDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResPromotionDetailDTO create(ReqPromotionDetailDTO dto) {
        Promotion promotion = promotionRepository.findById(dto.getPromotionId())
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        PromotionDetail entity = mapper.toEntity(dto);
        entity.setPromotion(promotion);
        entity.setProduct(product);

        PromotionDetailKey key = new PromotionDetailKey();
        key.setPromotionId(dto.getPromotionId());
        key.setProductId(dto.getProductId());
        entity.setId(key);

        PromotionDetail saved = promotionDetailRepository.save(entity);
        return mapper.toResPromotionDetailDTO(saved);
    }

    @Override
    public ResPromotionDetailDTO update(long promotionId, long productId, ReqPromotionDetailDTO dto) {
        PromotionDetailKey key = new PromotionDetailKey(promotionId, productId);
        PromotionDetail existing = promotionDetailRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("PromotionDetail not found"));
        mapper.updateFromDTO(dto, existing);
        PromotionDetail updated = promotionDetailRepository.save(existing);
        return mapper.toResPromotionDetailDTO(updated);
    }

    @Override
    public void delete(long promotionId, long productId) {
        PromotionDetailKey key = new PromotionDetailKey(promotionId, productId);
        promotionDetailRepository.deleteById(key);
    }

    @Override
    public ResPromotionDetailDTO getById(long promotionId, long productId) {
        PromotionDetailKey key = new PromotionDetailKey(promotionId, productId);
        PromotionDetail existing = promotionDetailRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("PromotionDetail not found"));
        return this.mapper.toResPromotionDetailDTO(existing);
    }

    @Override
    public List<ResPromotionDetailDTO> handleGetByProductId(Long productId) {
        return promotionDetailRepository.findByProduct_Id(productId).stream().map(mapper::toResPromotionDetailDTO).toList();
    }

    @Override
    public List<ResPromotionDetailDTO> handleGetByPromotionId(Long promotionId) {
        return promotionDetailRepository.findByPromotion_Id(promotionId).stream().map(mapper::toResPromotionDetailDTO).toList();
    }
    @Override
    public Optional<BestPromotionDTO> findBestActivePromotion(Long productId) {
        // 1. Lấy tất cả KM hợp lệ (đang active, trong thời gian) từ Repository
        List<PromotionDetail> activePromotions = promotionDetailRepository.findAllActivePromotionsForProduct(
                productId,
                Instant.now() // Sử dụng Instant.now()
        );

        if (activePromotions.isEmpty()) {
            return Optional.empty(); // Không có KM nào
        }

        PromotionDetail bestPromotionDetail = null;
        double maxDiscountAmount = 0.0; // Sử dụng double

        // 2. Lặp qua để tìm KM "tốt nhất" (giảm nhiều tiền nhất)
        for (PromotionDetail pd : activePromotions) {
            double originalPrice = pd.getProduct().getPrice();
            double discountAmount = calculateDiscount(pd, originalPrice);

            if (discountAmount > maxDiscountAmount) { // So sánh double
                maxDiscountAmount = discountAmount;
                bestPromotionDetail = pd;
            }
        }

        // 3. Nếu tìm thấy, chuyển đổi sang DTO để trả về
        if (bestPromotionDetail != null) {
            BestPromotionDTO dto = mapToBestPromotionDTO(bestPromotionDetail, maxDiscountAmount);
            return Optional.of(dto);
        }

        return Optional.empty();
    }

    /**
     * Helper: Tính toán số tiền giảm giá thực tế
     */
    private double calculateDiscount(PromotionDetail pd, double price) {
        Promotion promotion = pd.getPromotion();
        TypePromotion type = promotion.getType(); // Lấy 'type' từ Promotion
        double value = promotion.getValue();       // Lấy 'value' từ Promotion

        // Giả sử Enum của bạn có tên là PERCENT và FIXED_AMOUNT
        if (type == TypePromotion.PERCENT) {
            // Tính toán: price * (value / 100)
            return price * (value / 100.0);
        } else if (type == TypePromotion.FIXED_AMOUNT) {
            // Giảm giá trực tiếp, đảm bảo không giảm quá giá gốc
            return Math.min(value, price);
        }
        return 0.0; // Loại KM không xác định
    }

    /**
     * Helper: Chuyển đổi Entity sang DTO
     */
    private BestPromotionDTO mapToBestPromotionDTO(PromotionDetail pd, double discountAmount) {
        double originalPrice = pd.getProduct().getPrice();
        double finalPrice = originalPrice - discountAmount;
        Promotion promotion = pd.getPromotion();

        return new BestPromotionDTO(
                promotion.getId(),
                promotion.getName(),
                promotion.getType(),
                promotion.getValue(),
                originalPrice,
                discountAmount,
                finalPrice,
                pd.getEndDate() // Lấy 'endDate' từ PromotionDetail
        );
    }

}
