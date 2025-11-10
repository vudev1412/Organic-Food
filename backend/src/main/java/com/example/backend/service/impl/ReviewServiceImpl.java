package com.example.backend.service.impl;

import com.example.backend.domain.Review;
import com.example.backend.domain.response.ResReviewDTO;
import com.example.backend.mapper.ReviewMapper;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public Review handleCreateReview(Review review) {
        return reviewRepository.save(review);
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

    @Override
    public ResReviewDTO handleUpdateReview(Long id, Review review) {
        Review currentReview = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        if (review.getComment() != null) {
            currentReview.setComment(review.getComment());
        }
        if (review.getRating() > 0) {
            currentReview.setRating(review.getRating());
        }
        if (review.getCreatedAt() != null) {
            currentReview.setCreatedAt(review.getCreatedAt());
        }

        reviewRepository.save(currentReview);

        return reviewMapper.toResReviewDTO(currentReview);
    }

    @Override
    public void handleDeleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
