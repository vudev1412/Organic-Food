package com.example.backend.controller;

import com.example.backend.domain.Review;
import com.example.backend.domain.response.ResReviewDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.service.ReviewService;
import com.example.backend.util.annotation.ApiMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ResReviewDTO> createReview(@RequestBody Review review) {
        Review createdReview = reviewService.handleCreateReview(review);
        return ResponseEntity.ok(reviewService.handleGetReviewById(createdReview.getId()));
    }

    @GetMapping
    public ResponseEntity<List<ResReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.handleGetAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResReviewDTO> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.handleGetReviewById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResReviewDTO> updateReview(@PathVariable Long id, @RequestBody Review review) {
        return ResponseEntity.ok(reviewService.handleUpdateReview(id, review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.handleDeleteReview(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/product/{productId}")
    @ApiMessage("fetch reviews by product id")
    public ResponseEntity<ResultPaginationDTO> getReviewsByProductId(
            @PathVariable long productId,
            Pageable pageable
    ) {
        // Không cần @RequestParam thủ công nữa, dùng Pageable trực tiếp sẽ chuyên nghiệp hơn
        return ResponseEntity.ok(reviewService.handleGetReviewsByProductId(productId, pageable));
    }
}
