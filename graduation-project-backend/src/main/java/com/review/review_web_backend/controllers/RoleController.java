package com.review.review_web_backend.controllers;

import com.review.review_web_backend.dtos.request.RoleRequestDTO;
import com.review.review_web_backend.services.role.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/role")
@RequiredArgsConstructor

public class RoleController {

    private final RoleService roleService;

    @PostMapping("save")
    public ResponseEntity<?> saveRole(@Valid @RequestBody RoleRequestDTO request) {
        roleService.saveRole(request);
        return ResponseEntity.ok("Save successfully !");
    }

    @GetMapping("fetch/{id}")
    public ResponseEntity<?> fetchRoleById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @GetMapping("fetch")
    public ResponseEntity<?> fetchAllRole() {
        return ResponseEntity.ok(roleService.getAllRole());
    }

}
