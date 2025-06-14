package com.review.review_web_backend.services.product;

import com.review.review_web_backend.dtos.request.ProductRequestDTO;
import com.review.review_web_backend.dtos.response.ProductResponseDTO;
import com.review.review_web_backend.entities.User;

import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(Integer categoryId, ProductRequestDTO request, User user);

    ProductResponseDTO updateProduct(Long id, ProductRequestDTO request, User user);

    void deleteProduct(Long id, User user);

    ProductResponseDTO getProduct(Long id);

    List<ProductResponseDTO> getAllProductsByCategory(Integer categoryId);

    List<ProductResponseDTO> getProductsByViewerRank(User viewer);

    List<ProductResponseDTO> getAllProducts();
}
