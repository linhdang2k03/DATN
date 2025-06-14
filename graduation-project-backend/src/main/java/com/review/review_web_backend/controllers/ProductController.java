package com.review.review_web_backend.controllers;

import com.review.review_web_backend.dtos.request.ProductRequestDTO;
import com.review.review_web_backend.dtos.response.ProductResponseDTO;
import com.review.review_web_backend.entities.Role;
import com.review.review_web_backend.entities.User;
import com.review.review_web_backend.services.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/product")
@RequiredArgsConstructor

public class ProductController {
    private final ProductService productService;

    @PostMapping("/{categoryId}")
    public ResponseEntity<ProductResponseDTO> createProduct(
            @PathVariable Integer categoryId,
            @RequestBody ProductRequestDTO request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.getRole().getName().equals(Role.ADMIN) || (user.getRole().getName().equals(Role.EDITOR))) {
            return ResponseEntity.ok(productService.createProduct(categoryId, request, user));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/fetchAll")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.getRole().getName().equals(Role.ADMIN) || user.getRole().getName().equals(Role.EDITOR)) {
            return ResponseEntity.ok(productService.getAllProducts());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProductResponseDTO updatedProduct = productService.updateProduct(id, request, user);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        productService.deleteProduct(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("fetch/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long id) {
        ProductResponseDTO product = productService.getProduct(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("fetchAll/{categoryId}")
    public ResponseEntity<List<ProductResponseDTO>> getAllProductsByCategory(@PathVariable Integer categoryId) {
        List<ProductResponseDTO> products = productService.getAllProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("fetchByRank")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByViewerRank() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.getRole().getName().equals(Role.VIEWER)) {
            List<ProductResponseDTO> products = productService.getProductsByViewerRank(user);
            return ResponseEntity.ok(products);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
