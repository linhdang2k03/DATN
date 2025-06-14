package com.review.review_web_backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignUpRequestDTO {
    @NotBlank
    private String idCard;

    @NotBlank
    private String password;

    @NotBlank
    private String confirmPassword;
}
