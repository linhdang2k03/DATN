package com.review.review_web_backend.services.search;

import com.review.review_web_backend.dtos.response.ProductResponseDTO;
import com.review.review_web_backend.dtos.response.SearchResponseDTO;
import com.review.review_web_backend.entities.User;

import java.util.List;

public interface SearchService {
    List<ProductResponseDTO> searchByKeyword(String keyword, User user);
    List<ProductResponseDTO> getRecommendations(User user);
    List<ProductResponseDTO> getRecommendationsByKeyword(String keyword);
    List<SearchResponseDTO> getSearchStats();
    List<SearchResponseDTO> getSearchStatistics();

}