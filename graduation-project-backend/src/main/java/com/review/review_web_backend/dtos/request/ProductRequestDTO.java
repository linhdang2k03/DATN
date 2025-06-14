package com.review.review_web_backend.dtos.request;

import com.review.review_web_backend.enums.Status;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductRequestDTO {
    private Long id;
    private String productName;
    private String avatar;
    private Double cost;
    private Double price;
    private String startDate;
    private String endDate;
    private Status status;
    private String description;
    private Integer categoryId;
}
