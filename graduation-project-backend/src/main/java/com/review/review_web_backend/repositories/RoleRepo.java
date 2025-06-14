package com.review.review_web_backend.repositories;

import com.review.review_web_backend.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo extends JpaRepository<Role, Integer> {

    // Truy vấn để tìm Role không phân biệt chữ hoa/chữ thường
    @Query("SELECT r FROM Role r WHERE LOWER(r.name) = LOWER(:name)")
    Role findByNameIgnoreCase(@Param("name") String name);

    // Kiểm tra xem role có tồn tại theo tên hay không
    boolean existsByName(String name);
}

