
package com.example.backend.repository;

import com.example.backend.domain.Review;
import com.example.backend.domain.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Transactional
    void deleteAllByUser(User user);
    boolean existsByUserIdAndProductId(long userId, long productId);
    Page<Review> findAllByProductId(long productId, Pageable pageable);
    List<Review> findByProductId(long productId);
    List<Review> findAllByProductId(long productId);
}
