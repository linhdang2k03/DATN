package com.review.review_web_backend.services.category;

import com.review.review_web_backend.dtos.request.CategoryRequestDTO;
import com.review.review_web_backend.dtos.response.CategoryResponseDTO;
import com.review.review_web_backend.entities.Product;
import com.review.review_web_backend.entities.Category;
import com.review.review_web_backend.entities.Role;
import com.review.review_web_backend.entities.User;
import com.review.review_web_backend.repositories.ProductRepo;
import com.review.review_web_backend.repositories.CategoryRepo;
import com.review.review_web_backend.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepo categoryRepo;
    private final UserRepo userRepo;
    private final ProductRepo productRepo;

    @Override
    public Category createCategory(CategoryRequestDTO request, User manager) {
        if (manager.getRole().getName().equals(Role.ADMIN)) {
            return categoryRepo.save(
                    Category.builder()
                            .name(request.getName())
                            .level(request.getLevel())
                            .manager(manager)
                            .build()
            );
        } else {
            throw new RuntimeException("Only admin can create categories");
        }
    }

    @Override
    public Category updateCategory(Integer id, CategoryRequestDTO request, User user) {
        Optional<Category> existingCategory = categoryRepo.findById(id);
        if (existingCategory.isPresent()) {
            Category category = existingCategory.get();
            if (category.getManager().equals(user) || user.getRole().getName().equals(Role.ADMIN)) {
                category.setName(request.getName());
                category.setLevel(request.getLevel());
                category.setManager(user);
                return categoryRepo.save(category);
            } else {
                throw new RuntimeException("User doesn't have permission to update this category !");
            }
        }
        throw new RuntimeException("Category not found with id : " + id);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id, User user) {
        Optional<Category> existingCategory = categoryRepo.findById(id);
        if (existingCategory.isPresent()) {
            Category category = existingCategory.get();
            if (category.getManager().equals(user) || user.getRole().getName().equals(Role.ADMIN)) {
                List<Product> products = productRepo.findByCategoryId(id);
                categoryRepo.deleteById(id);
                return;
            } else {
                throw new RuntimeException("User doesn't have permission to delete this category !");
            }
        }
        throw new RuntimeException("Category not found with id : " + id);
    }

    @Override
    public Category getCategoryById(Integer id) {
        return categoryRepo.findById(id).orElseThrow(() -> new RuntimeException("Category not found with id : " + id));
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> categoryList = categoryRepo.findAll();
        return categoryList.stream().map(
                category -> CategoryResponseDTO.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .manager(category.getManager().getRole().getName())
                        .managerId(Math.toIntExact(category.getManager() != null ? category.getManager().getId() : null))
                        .build()
        ).toList();
    }

    @Override
    public void assignManagerToCategory(Integer categoryId, Long userId) {
        Category category = categoryRepo.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found with id : " + categoryId));
        User manager = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("Manager not found with id : " + userId));
        category.setManager(manager);
        categoryRepo.save(category);
    }

    @Override
    public List<CategoryResponseDTO> getCategoriesByManager(Long managerId) {
        User manager = userRepo.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found with id : " + managerId));
        List<Category> categoryList = categoryRepo.findByManager(manager);
        return categoryList.stream().map(
                category -> CategoryResponseDTO.builder()
                        .name(category.getName())
                        .level(category.getLevel())
                        .build()
        ).toList();
    }

    @Override
    public List<Category> getCategoriesByViewerRank(User viewer) {
        return categoryRepo.findByLevelLessThanEqual(viewer.getRank());
    }

    // phương thức này cho phép kiểm tra quyền truy cập của ngươời dùng vào 1 CATEGORY cụ thể
    // nghĩa là editor cũng có thể phải quản lý theo level ( hoặc có the ko cần theo level )
    public boolean canAccessCategory(User user, Category category) {
        if (user.getRole().getName().equals(Role.ADMIN)) {
            return true;
        }
        // chỗ này sau thêm EDITOR ?
        if (user.getRole().getName().equals(Role.VIEWER)) {
            Integer userRank = user.getRank();
            Integer categoryLevel = category.getLevel();
            return userRank >= categoryLevel;
        }
        return false;
    }


}
