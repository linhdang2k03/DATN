package com.review.review_web_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.review.review_web_backend.enums.Gender;
import com.review.review_web_backend.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Entity
@Table(name = "users")
public class User extends AbstractEntity<Long> implements UserDetails {
    @Column
    private String idCard;
    @Column(name = "user_name")
    private String Name;
    @Column
    private String password;
    @Column
    private String avatar;
    @Column
    private Instant birthDate;
    @Column
    private Gender gender;
    @Column
    private String phone;
    @Column
    private String email;
    @Column
    private String address;
    @Column
    private Status status;
    @Column
    private Integer rank;

    // Trường createdDate mới thêm
    @Column(name = "created_date", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = new Date();  // Set thời gian hiện tại khi tạo mới bản ghi
    }

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
    @OneToMany(mappedBy = "manager")
    @JsonIgnore
    private Set<Category> categories;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> grantedAuthorityList = new ArrayList<>();
        grantedAuthorityList.add(new SimpleGrantedAuthority("ROLE_" + getRole().getName().toUpperCase()));
        return grantedAuthorityList;
    }

    @Override
    public String getUsername() {
        return Name;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // default is true
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
