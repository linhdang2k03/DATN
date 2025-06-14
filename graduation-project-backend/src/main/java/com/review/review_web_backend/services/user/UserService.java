package com.review.review_web_backend.services.user;

import com.review.review_web_backend.dtos.request.SignInRequestDTO;
import com.review.review_web_backend.dtos.request.SignUpRequestDTO;
import com.review.review_web_backend.dtos.request.UserRequestDTO;
import com.review.review_web_backend.dtos.response.UserResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface UserService {
    ResponseEntity<?> signUp(SignUpRequestDTO request);

    ResponseEntity<?> signIn(SignInRequestDTO request);


    List<UserResponseDTO> getAllUsers();

    List<UserResponseDTO> getUsersByRole(String roleName);

    ResponseEntity<?> updateUser(UserRequestDTO request);

    ResponseEntity<?> detailsUser(UserRequestDTO request);

    ResponseEntity<?> deleteUser(UserRequestDTO request);

    Map<String, Long> getUserCountByMonth(int year);
}
