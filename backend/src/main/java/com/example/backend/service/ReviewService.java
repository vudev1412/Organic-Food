package com.example.backend.service;

import com.example.backend.domain.Review;
import com.example.backend.domain.response.ResReviewDTO;

import java.util.List;

public interface ReviewService {
    Review handleCreateReview(Review review);
    List<ResReviewDTO> handleGetAllReviews();
    ResReviewDTO handleGetReviewById(Long id);
    ResReviewDTO handleUpdateReview(Long id, Review review);
    void handleDeleteReview(Long id);
}
