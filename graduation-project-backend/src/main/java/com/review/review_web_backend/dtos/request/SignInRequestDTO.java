package com.review.review_web_backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignInRequestDTO {
    @NotBlank
    private String idCard;

    @NotBlank
    private String password;

}
