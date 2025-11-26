package com.example.backend.service.impl;

import com.example.backend.domain.Product;
import com.example.backend.domain.Review;
import com.example.backend.domain.response.ResReviewDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.enums.StatusInvoice;
import com.example.backend.enums.StatusOrder;
import com.example.backend.mapper.ReviewMapper;
import com.example.backend.repository.OrderDetailRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private void updateProductRatingAvg(long productId) {
        // 1. Lấy product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // 2. ⭐ Sử dụng findByProductId() thay vì findAllByProductId()
        List<Review> reviews = reviewRepository.findByProductId(productId);

        // 3. Tính rating trung bình
        double avgRating = 0.0;
        if (!reviews.isEmpty()) {
            avgRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            // Làm tròn đến 1 chữ số thập phân (VD: 4.566666 -> 4.6)
            avgRating = Math.round(avgRating * 10.0) / 10.0;
        }

        // 4. Cập nhật vào product
        product.setRating_avg(avgRating);
        productRepository.save(product);

        System.out.println("✅ Updated rating_avg for product " + productId + ": " + avgRating);
    }
    public Review mapResReviewDTOToReview(ResReviewDTO dto) {
        // MapStruct sẽ tự tạo tham chiếu Product và User bằng getReferenceById()
        return reviewMapper.toReview(dto);
    }
    @Override
    @Transactional
    public Review handleCreateReview(Review review) {
        long userId = review.getUser().getId();
        long productId = review.getProduct().getId();

        // 1. Kiểm tra xem đã review chưa
        if (reviewRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi.");
        }

        // 2. Kiểm tra điều kiện mua hàng chặt chẽ
        boolean isValidPurchase = orderDetailRepository.existsByProductAndUserAndStatus(
                productId,
                userId,
                StatusInvoice.PAID,
                StatusOrder.DELIVERED
        );

        if (!isValidPurchase) {
            throw new RuntimeException("Bạn cần mua, thanh toán và nhận hàng thành công trước khi đánh giá.");
        }

        review.setCreatedAt(Instant.now());

        // 3. Lưu review
        Review savedReview = reviewRepository.save(review);

        // ⭐ 4. Cập nhật rating_avg của product
        updateProductRatingAvg(productId);

        return savedReview;
    }


    @Override
    public List<ResReviewDTO> handleGetAllReviews() {
        return reviewRepository.findAll().stream()
                .map(reviewMapper::toResReviewDTO)
                .toList();
    }

    @Override
    public ResReviewDTO handleGetReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        return reviewMapper.toResReviewDTO(review);
    }

    // ⭐ THÊM @Transactional
    @Override
    @Transactional
    public ResReviewDTO handleUpdateReview(Long id, Review review) {
        Review currentReview = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        // Lưu productId để cập nhật rating sau
        long productId = currentReview.getProduct().getId();

        // Cập nhật các trường
        if (review.getComment() != null) {
            currentReview.setComment(review.getComment());
        }
        if (review.getRating() > 0) {
            currentReview.setRating(review.getRating());
        }
        // ⭐ FIX: Không nên update createdAt, thêm updatedAt thay vào
        currentReview.setUpdatedAt(Instant.now());

        Review savedReview = reviewRepository.save(currentReview);

        // ⭐ Cập nhật rating_avg của product (vì rating có thể đã thay đổi)
        updateProductRatingAvg(productId);

        return reviewMapper.toResReviewDTO(savedReview);
    }

    @Override
    @Transactional
    public void handleDeleteReview(Long id) {
        // 1. Lấy review để biết productId trước khi xóa
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        long productId = review.getProduct().getId();

        // 2. Xóa review
        reviewRepository.deleteById(id);

        // ⭐ 3. Cập nhật rating_avg của product (vì số lượng review đã giảm)
        updateProductRatingAvg(productId);
    }
    private ResReviewDTO mapToResReviewDTO(Review review) {
        // ... Logic mapping fields ...
        return new ResReviewDTO(); // Thay thế bằng logic thực tế của bạn
    }
    @Override
    public ResultPaginationDTO handleGetReviewsByProductId(long productId, Pageable pageable) {
        // 1. Lấy dữ liệu dạng Page từ Repository
        Page<Review> pageReviews = reviewRepository.findAllByProductId(productId, pageable);

        // 2. Map từ Entity (Review) sang DTO (ResReviewDTO)
        // Giả sử bạn có reviewMapper, hoặc bạn có thể dùng lambda như bên dưới
        Page<ResReviewDTO> pageResReviews = pageReviews.map(review -> {
            ResReviewDTO dto = new ResReviewDTO();
            dto.setId(review.getId());
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setCreatedAt(review.getCreatedAt());
            dto.setProductId(review.getProduct().getId());
            if (review.getUser() != null) {
                dto.setUserId(review.getUser().getId());
                dto.setUserName(review.getUser().getName()); // Lấy tên từ User entity
                dto.setUserAvatar(review.getUser().getImage()); // Lấy ảnh từ User entity
            }
            // Map thêm các trường khác nếu cần
            return dto;
        });

        // 3. Khởi tạo ResultPaginationDTO
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        // 4. Set thông tin Meta (Lưu ý +1 cho page vì Spring tính từ 0)
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(pageResReviews.getTotalPages());
        meta.setTotal(pageResReviews.getTotalElements());

        // 5. Gán dữ liệu vào rs
        rs.setMeta(meta);
        rs.setResult(pageResReviews.getContent());

        return rs;
    }
}
