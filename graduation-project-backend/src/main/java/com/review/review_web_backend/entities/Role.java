package com.review.review_web_backend.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Entity
@Table(name = "roles")
public class Role extends AbstractEntity<Integer> {
    @Column
    private String name;

    public static String ADMIN = "ADMIN";
    public static String EDITOR = "EDITOR";
    public static String VIEWER = "VIEWER";

    @OneToMany(mappedBy = "role")
    private Set<User> users;

    // Phương thức để deserialize từ chuỗi JSON
    @JsonCreator
    public static Role fromString(String name) {
        Role role = new Role();
        role.setName(name);
        return role;
    }

    // Serialize `Role` thành chuỗi JSON
    @JsonValue
    public String getName() {
        return name;
    }
}
