package com.review.review_web_backend.controllers;

import com.review.review_web_backend.dtos.request.SearchRequestDTO;
import com.review.review_web_backend.dtos.response.ProductResponseDTO;
import com.review.review_web_backend.dtos.response.SearchResponseDTO;
import com.review.review_web_backend.entities.User;
import com.review.review_web_backend.services.search.SearchService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("${api.prefix}/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@RequestParam String keyword) {
        User user = getCurrentUserOrNull();
        List<ProductResponseDTO> results = searchService.searchByKeyword(keyword, user);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/recommendations")
    public ResponseEntity<List<ProductResponseDTO>> getRecommendations(@RequestBody(required = false) SearchRequestDTO request) {
        User user = getCurrentUserOrNull();

        if (request != null && request.getKeyword() != null && !request.getKeyword().isBlank()) {
            return ResponseEntity.ok(searchService.getRecommendationsByKeyword(request.getKeyword()));
        }

        return ResponseEntity.ok(searchService.getRecommendations(user));
    }

    @GetMapping("/stats")
    public ResponseEntity<List<SearchResponseDTO>> getSearchStatsSummary() {
        return ResponseEntity.ok(searchService.getSearchStats());
    }

    @GetMapping("/keyword-stats")
    public ResponseEntity<List<SearchResponseDTO>> getSearchStatsByKeyword() {
        return ResponseEntity.ok(searchService.getSearchStatistics());
    }



    /**
     * Helper: Lấy thông tin người dùng nếu đã đăng nhập, null nếu không
     */
    private User getCurrentUserOrNull() {
        try {
            return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            return null;
        }
    }
}
