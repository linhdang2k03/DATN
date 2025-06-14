package com.review.review_web_backend.repositories;

import com.review.review_web_backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findAllByCategory_Id(Long categoryId);

    List<Product> findByCategoryId(Integer categoryId);

    List<Product> findByCategoryIdIn(List<Integer> categoryIds);
}
