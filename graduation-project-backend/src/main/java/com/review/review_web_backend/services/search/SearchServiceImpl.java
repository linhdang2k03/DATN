package com.review.review_web_backend.services.search;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.review.review_web_backend.dtos.response.CategorySimpleDTO;
import com.review.review_web_backend.dtos.response.ProductResponseDTO;
import com.review.review_web_backend.dtos.response.SearchResponseDTO;
import com.review.review_web_backend.entities.Product;
import com.review.review_web_backend.entities.SearchHistory;
import com.review.review_web_backend.entities.User;
import com.review.review_web_backend.repositories.ProductRepo;
import com.review.review_web_backend.repositories.SearchRepo;
import com.review.review_web_backend.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final ProductRepo productRepo;
    private final SearchRepo searchRepo;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public List<ProductResponseDTO> searchByKeyword(String keyword, User user) {
        // Lưu lịch sử tìm kiếm
        SearchHistory history = SearchHistory.builder()
                .keyword(keyword)
                .searchTime(LocalDateTime.ofInstant(Instant.now(), java.time.ZoneId.systemDefault()))
                .user(user)
                .build();
        searchRepo.save(history);

        List<Product> results = productRepo.findAll().stream()
                .filter(p -> p.getProductName().toLowerCase().contains(keyword.toLowerCase())
                        || p.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                .toList();

        return mapToDTO(results);
    }


    @Override
    public List<ProductResponseDTO> getRecommendations(User user) {
        try {
            // 1. Tìm keyword gần nhất từ user
            String keyword = "desktop computers pcs"; // fallback mặc định
            if (user != null) {
                List<SearchHistory> history = searchRepo.findByUserOrderBySearchTimeDesc(user);
                if (!history.isEmpty()) {
                    keyword = history.get(0).getKeyword(); // lấy từ khóa mới nhất
                }
            }

            // 2. Gọi Flask API như cũ
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("keyword", keyword);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "http://localhost:5000/recommend", request, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<ProductResponseDTO> products = objectMapper.readValue(
                        response.getBody(),
                        new TypeReference<List<ProductResponseDTO>>() {}
                );
                return products;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // fallback
        return mapToDTO(productRepo.findAll().stream().limit(5).toList());
    }


    private List<ProductResponseDTO> mapToDTO(List<Product> products) {
        return products.stream().map(p -> ProductResponseDTO.builder()
                .id(p.getId())
                .productName(p.getProductName())
                .avatar(p.getAvatar())
                .price(p.getPrice())
                .cost(p.getCost())
                .description(p.getDescription())
                .startDate(DateUtils.parseToLocalDate(p.getStartDate()))
                .category(new CategorySimpleDTO(
                        p.getCategory().getId(),
                        p.getCategory().getName()
                ))
                .build()).collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDTO> getRecommendationsByKeyword(String keyword) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, String> payload = new HashMap<>();
            payload.put("keyword", keyword);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "http://localhost:5000/recommend", request, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<ProductResponseDTO> products = objectMapper.readValue(
                        response.getBody(),
                        new TypeReference<List<ProductResponseDTO>>() {}
                );
                return products;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // fallback nếu lỗi
        return mapToDTO(productRepo.findAll().stream().limit(5).toList());
    }

    @Override
    public List<SearchResponseDTO> getSearchStats() {
        return searchRepo.getTopSearchedKeywords();
    }

    @Override
    public List<SearchResponseDTO> getSearchStatistics() {
        List<Object[]> result = searchRepo.countSearchByKeyword();
        return result.stream()
                .map(obj -> new SearchResponseDTO((String) obj[0], ((Number) obj[1]).intValue(), null))
                .collect(Collectors.toList());
    }


}
