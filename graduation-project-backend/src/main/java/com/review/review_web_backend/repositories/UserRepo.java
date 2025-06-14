package com.review.review_web_backend.repositories;

import com.review.review_web_backend.entities.Role;
import com.review.review_web_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.Map;


@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByIdCard(String idCard);

    List<User> findByRole(Role role);
}
