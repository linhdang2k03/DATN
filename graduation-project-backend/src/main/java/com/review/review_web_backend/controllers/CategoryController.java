package com.review.review_web_backend.controllers;


import com.review.review_web_backend.dtos.request.CategoryRequestDTO;
import com.review.review_web_backend.dtos.response.CategoryResponseDTO;
import com.review.review_web_backend.entities.Category;
import com.review.review_web_backend.entities.Role;
import com.review.review_web_backend.entities.User;
import com.review.review_web_backend.repositories.CategoryRepo;
import com.review.review_web_backend.repositories.UserRepo;
import com.review.review_web_backend.services.category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("${api.prefix}/category")
@RequiredArgsConstructor

public class CategoryController {
    private final CategoryService categoryService;
    private final UserRepo userRepo;

    @PostMapping("admin/create")
    public ResponseEntity<Category> createCategory(@RequestBody CategoryRequestDTO request) {
        User manager = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (manager.getRole().getName().equals(Role.ADMIN)) {
            Category createdCategory = categoryService.createCategory(request, manager);
            return ResponseEntity.ok(createdCategory);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PutMapping("admin/update/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Integer id,
            @RequestBody CategoryRequestDTO request,
            @RequestParam Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Category updatedCategory = categoryService.updateCategory(id, request, user);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("admin/delete/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Integer id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println(user.getRole().getName());
        categoryService.deleteCategory(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("admin/fetch/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable Integer id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @GetMapping("admin/fetch")
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        List<CategoryResponseDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping("admin/assignManager")
    public ResponseEntity<Void> assignManagerToCategory(
            @RequestParam Integer id,
            @RequestParam Long managerId) {
        categoryService.assignManagerToCategory(id, managerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("admin/fetch/manager/{managerId}")
    public ResponseEntity<List<CategoryResponseDTO>> getCategoriesByManager(@PathVariable Long managerId) {
        List<CategoryResponseDTO> categories = categoryService.getCategoriesByManager(managerId);
        return ResponseEntity.ok(categories);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getCategories() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.getRole().getName().equals(Role.VIEWER)) {
            List<Category> categoryList = categoryService.getCategoriesByViewerRank(user);
            return ResponseEntity.ok(categoryList.stream().map(
                    category -> CategoryResponseDTO.builder()
                            .name(category.getName())
                            .level(category.getLevel())
                            .build()
            ).toList());
        } else {
            List<CategoryResponseDTO> categoryList = categoryService.getAllCategories();
            return ResponseEntity.ok(categoryList);
        }
    }
}
