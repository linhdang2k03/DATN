package com.review.review_web_backend.dtos.request;

import com.review.review_web_backend.validations.EnumAnnotation;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class RoleRequestDTO {
    @EnumAnnotation(name = "role" , regexp = "USER|ADMIN|VIEWER")
    private String name;
}
