package com.review.review_web_backend.services.role;

import com.review.review_web_backend.dtos.request.RoleRequestDTO;
import com.review.review_web_backend.dtos.response.RoleResponseDTO;

import java.util.List;

public interface RoleService {
    void saveRole(RoleRequestDTO request);
    RoleResponseDTO getRoleById(Integer id);
    List<RoleResponseDTO> getAllRole();
}
