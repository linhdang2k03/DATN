package com.review.review_web_backend.dtos.request;

import com.review.review_web_backend.entities.Category;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class CategoryRequestDTO {
    private String name;
    private Integer level;
    private Long manager_id;
    private Category parent;
}
