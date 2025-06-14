package com.review.review_web_backend.repositories;

import com.review.review_web_backend.entities.Category;
import com.review.review_web_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer> {
    List<Category> findByManager(User manager);

    boolean existsByIdAndManager(Integer id, User manager);

    List<Category> findByLevelLessThanEqual(Integer level);
}
