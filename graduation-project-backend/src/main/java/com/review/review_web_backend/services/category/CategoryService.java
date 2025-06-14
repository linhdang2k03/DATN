package com.review.review_web_backend.services.category;

import com.review.review_web_backend.dtos.request.CategoryRequestDTO;
import com.review.review_web_backend.dtos.response.CategoryResponseDTO;
import com.review.review_web_backend.entities.Category;
import com.review.review_web_backend.entities.User;

import java.util.List;

public interface CategoryService {
    Category createCategory(CategoryRequestDTO request, User manager);

    Category updateCategory(Integer id, CategoryRequestDTO request, User user);

    void deleteCategory(Integer id, User user);

    Category getCategoryById(Integer id);

    List<CategoryResponseDTO> getAllCategories();

    void assignManagerToCategory(Integer categoryId, Long userId);

    List<CategoryResponseDTO> getCategoriesByManager(Long managerId);

    List<Category> getCategoriesByViewerRank(User viewer);
}
