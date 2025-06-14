package com.review.review_web_backend.services.role;

import com.review.review_web_backend.dtos.request.RoleRequestDTO;
import com.review.review_web_backend.dtos.response.RoleResponseDTO;
import com.review.review_web_backend.entities.Role;
import com.review.review_web_backend.repositories.RoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class RoleServiceImpl implements RoleService {
    private final RoleRepo roleRepo;

    @Override
    public void saveRole(RoleRequestDTO request) {
        roleRepo.save(Role.builder()
                .name(request.getName())
                .build());
    }

    @Override
    public RoleResponseDTO getRoleById(Integer id) {
        Optional<Role> findRole = roleRepo.findById(id);
        if (findRole.isPresent()) {
            Role role = findRole.get();
            return RoleResponseDTO.builder()
                    .name(role.getName())
                    .build();
        } else {
            return null;
        }
    }

    @Override
    public List<RoleResponseDTO> getAllRole() {
        List<Role> roleList = roleRepo.findAll();
        return roleList.stream().map(role -> RoleResponseDTO.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
