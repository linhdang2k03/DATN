package com.review.review_web_backend.services.user;

import com.review.review_web_backend.components.JwtTokenCommon;
import com.review.review_web_backend.dtos.request.SignInRequestDTO;
import com.review.review_web_backend.dtos.request.SignUpRequestDTO;
import com.review.review_web_backend.dtos.request.UserRequestDTO;
import com.review.review_web_backend.dtos.response.UserResponseDTO;
import com.review.review_web_backend.entities.Category;
import com.review.review_web_backend.entities.Role;
import com.review.review_web_backend.entities.User;
import com.review.review_web_backend.enums.Status;
import com.review.review_web_backend.repositories.RoleRepo;
import com.review.review_web_backend.repositories.UserRepo;
import com.review.review_web_backend.utils.DateUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenCommon jwtTokenCommon;

    @Override
    public ResponseEntity<?> signUp(SignUpRequestDTO request) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> user = userRepo.findByIdCard(request.getIdCard());
        if (user.isPresent()) {
            response.put("result", false);
            response.put("message", "User with this idCard already exists!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            response.put("result", false);
            response.put("message", "Passwords do not match");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        Role role = roleRepo.findByNameIgnoreCase("VIEWER");
        User newAccount = User.builder()
                .idCard(request.getIdCard())
                .password(passwordEncoder.encode(request.getPassword()))
                .status(Status.ACTIVE)
                .role(role)
                .build();
        userRepo.save(newAccount);

        response.put("result", true);
        response.put("message", "User registered successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> signIn(SignInRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> existAccount = userRepo.findByIdCard(request.getIdCard());
        if (existAccount.isPresent()) {
            User user = existAccount.get();
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                response.put("result", false);
                response.put("message", "Incorrect password, please try again!");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getIdCard(),
                                request.getPassword()
                        )
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String token = jwtTokenCommon.generateToken(user);
                response.put("result", true);
                response.put("token", token);
                response.put("message", "User signed-in successfully");
                System.out.println(token);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } catch (AuthenticationException e) {
                response.put("result", false);
                response.put("message", "SignIn failure!");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } else {
            response.put("result", false);
            response.put("message", "SignIn failure!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }


    @Override
    public List<UserResponseDTO> getAllUsers() {

        List<User> userList = userRepo.findAll();
        return userList.stream().map(
                user -> UserResponseDTO.builder()
                        .id(user.getId())
                        .idCard(user.getIdCard())
                        .userName(user.getName())
                        .role(user.getRole().getName())
                        //add this
                        .createdDate(user.getCreatedDate())
                        .build()
        ).toList();
    }

    @Override
    public List<UserResponseDTO> getUsersByRole(String roleName) {
        Role role = roleRepo.findByNameIgnoreCase(roleName);
        List<User> userList = userRepo.findByRole(role);
        return userList.stream().map(
                user -> UserResponseDTO.builder()
                        .idCard(user.getIdCard())
                        .userName(user.getUsername())
                        .role(user.getRole().getName())
                        .build()
        ).toList();
    }


    public ResponseEntity<?> updateUser(UserRequestDTO request) {
        User existingUser = userRepo.findByIdCard(request.getIdCard())
                .orElseThrow(() -> new RuntimeException("User not found with id : " + request.getIdCard()));

        // Cập nhật thông tin người dùng
        existingUser.setName(request.getUserName());

        // Xử lý ngày sinh
        if (request.getBirthDate() != null && !request.getBirthDate().isEmpty()) {
            existingUser.setBirthDate(DateUtils.parseToInstant(request.getBirthDate()));  // Chuyển chuỗi thành Instant
        }

        // Xử lý Role
        Role newRole = roleRepo.findByNameIgnoreCase(request.getRole());
        if (newRole == null) {
            throw new RuntimeException("Role not found: " + request.getRole());
        }
        existingUser.setRole(newRole);

        // Xử lý các trường hợp null cho address, phone, email
        if (request.getAddress() != null) {
            existingUser.setAddress(request.getAddress());
        }

        if (request.getPhoneNumber() != null) {
            existingUser.setPhone(request.getPhoneNumber());
        }

        if (request.getEmail() != null) {
            existingUser.setEmail(request.getEmail());
        }

        // Xử lý mật khẩu
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepo.save(existingUser);
        return ResponseEntity.ok("User updated successfully");
    }



    @Override
    public ResponseEntity<?> detailsUser(UserRequestDTO request) {
        User existingUser = userRepo.findByIdCard(request.getIdCard()).orElseThrow(() -> new RuntimeException("User not found with id : " + request.getIdCard()));
        return new ResponseEntity<>(UserResponseDTO.builder()
                .idCard(existingUser.getIdCard())
                .userName(existingUser.getName())
                .address(existingUser.getAddress())
                .birthDate(DateUtils.parseToLocalDate(existingUser.getBirthDate()))
                .gender(existingUser.getGender())
                .phoneNumber(existingUser.getPhone())
                .email(existingUser.getEmail())
                .role(existingUser.getRole().getName())
                .build() , HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> deleteUser(UserRequestDTO request) {
        User existingUser = userRepo.findByIdCard(request.getIdCard()).orElseThrow(() -> new RuntimeException("User not found with id : " + request.getIdCard()));
        userRepo.delete(existingUser);
        return ResponseEntity.ok("Delete user successfully !");
    }

    //a tis
    @PersistenceContext
    private EntityManager entityManager;
    @Override
    public Map<String, Long> getUserCountByMonth(int year) {
        String sql = "SELECT TO_CHAR(u.created_date, 'YYYY-MM') AS yearMonth, COUNT(*) " +
                "FROM users u " +
                "WHERE EXTRACT(YEAR FROM u.created_date) = ?1 " +
                "GROUP BY TO_CHAR(u.created_date, 'YYYY-MM') " +
                "ORDER BY yearMonth";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter(1, year);

        List<Object[]> results = query.getResultList();
        Map<String, Long> userCountByMonth = new HashMap<>();

        for (Object[] result : results) {
            String yearMonth = (String) result[0];
            Long count = ((Number) result[1]).longValue();
            userCountByMonth.put(yearMonth, count);
        }

        return userCountByMonth;
    }

}
