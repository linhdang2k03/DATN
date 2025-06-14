package com.review.review_web_backend.controllers;

import com.review.review_web_backend.dtos.request.SignInRequestDTO;
import com.review.review_web_backend.dtos.request.SignUpRequestDTO;
import com.review.review_web_backend.dtos.request.UserRequestDTO;
import com.review.review_web_backend.dtos.response.UserResponseDTO;
import com.review.review_web_backend.services.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("signUp")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequestDTO request) {
        return userService.signUp(request);
    }

    @PostMapping("signIn")
    public ResponseEntity<?> signIn(@Valid @RequestBody SignInRequestDTO request) {
        return userService.signIn(request);
    }



    @GetMapping("getAll")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/role/{roleName}")
    public ResponseEntity<List<UserResponseDTO>> getUsersByRole(@PathVariable String roleName) {
        return ResponseEntity.ok(userService.getUsersByRole(roleName));
    }

    @PutMapping("edit")
    public ResponseEntity<?> editUser(@RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(userService.updateUser(request));
    }

    @PostMapping("detail")
    public ResponseEntity<?> detailUser(@RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(userService.detailsUser(request));
    }

    @DeleteMapping("delete")
    public ResponseEntity<?> deleteUser(@RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(userService.deleteUser(request));
    }

    @GetMapping("/count-by-month")
    public ResponseEntity<Map<String, Long>> getUserCountByMonth(@RequestParam int year) {
        Map<String, Long> userCountByMonth = userService.getUserCountByMonth(year);
        return ResponseEntity.ok(userCountByMonth);
    }



}
