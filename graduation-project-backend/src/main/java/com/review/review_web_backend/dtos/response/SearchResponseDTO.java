package com.review.review_web_backend.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SearchResponseDTO {

    @JsonProperty("keyword")
    private String keyword;

    @JsonProperty("totalResults")
    private int totalResults;

    @JsonProperty("products")
    private List<ProductResponseDTO> products;

    public SearchResponseDTO(String keyword, Long total) {
        this.keyword = keyword;
        this.totalResults = total.intValue();
    }
}