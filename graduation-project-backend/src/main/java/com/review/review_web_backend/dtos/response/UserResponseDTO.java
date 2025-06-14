package com.review.review_web_backend.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.review.review_web_backend.enums.Gender;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    @JsonProperty("id")
    private long id;
    @JsonProperty("idCard")
    private String idCard;
    @JsonProperty("userName")
    private String userName;
    @JsonProperty("password")
    private String password;
    @JsonProperty("role")
    private String role;
    @JsonProperty("address")
    private String address;
    @JsonProperty("birthDate")
    private String birthDate;
    @JsonProperty("gender")
    private Gender gender;
    @JsonProperty("phoneNumber")
    private String phoneNumber;
    @JsonProperty("email")
    private String email;

    @JsonProperty("createdDate")
    private Date createdDate;

}
