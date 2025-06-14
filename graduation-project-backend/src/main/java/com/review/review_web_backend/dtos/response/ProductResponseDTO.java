package com.review.review_web_backend.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.review.review_web_backend.entities.Category;
import com.review.review_web_backend.enums.Status;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class ProductResponseDTO {
    @JsonProperty("id")
    private Long id;
    @JsonProperty("productName")
    private String productName;
    @JsonProperty("avatar")
    private String avatar;
    @JsonProperty("cost")
    private Double cost;
    @JsonProperty("price")
    private Double price;
    @JsonProperty("startDate")
    private String startDate;
    @JsonProperty("status")
    private Status status;
    @JsonProperty("description")
    private String description;
    @JsonProperty("category")
    private CategorySimpleDTO category;
}
