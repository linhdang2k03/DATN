package com.review.review_web_backend.repositories;

import com.review.review_web_backend.dtos.response.SearchResponseDTO;
import com.review.review_web_backend.entities.SearchHistory;
import com.review.review_web_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SearchRepo extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserOrderBySearchTimeDesc(User user);
    @Query("SELECT new com.review.review_web_backend.dtos.response.SearchResponseDTO(s.keyword, COUNT(s)) " +
            "FROM SearchHistory s GROUP BY s.keyword ORDER BY COUNT(s) DESC")
    List<SearchResponseDTO> getTopSearchedKeywords();
    @Query("SELECT s.keyword, COUNT(s) FROM SearchHistory s GROUP BY s.keyword ORDER BY COUNT(s) DESC")
    List<Object[]> countSearchByKeyword();

}
