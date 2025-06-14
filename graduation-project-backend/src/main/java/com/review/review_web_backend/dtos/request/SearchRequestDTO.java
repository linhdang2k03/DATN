package com.review.review_web_backend.dtos.request;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SearchRequestDTO {
    private String keyword;
}
