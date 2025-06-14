package com.review.review_web_backend.dtos.response;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CategorySimpleDTO {
    private Integer id;
    private String name;
}
