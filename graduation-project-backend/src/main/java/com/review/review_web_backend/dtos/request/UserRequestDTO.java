package com.review.review_web_backend.dtos.request;

import com.review.review_web_backend.entities.Role;
import com.review.review_web_backend.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserRequestDTO {
    @NotBlank
    private String idCard;
    private String password;
    private String userName;
    private String address;
    private String birthDate;
    @NotNull(message = "Gender cannot be null")
    private Gender gender;  // Enum validation
    private String phoneNumber;
    private String email;
    private String role;
}

