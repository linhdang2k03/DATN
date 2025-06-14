package com.review.review_web_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Entity
@Table(name = "categories")
public class Category extends AbstractEntity<Integer> {
    @Column
    private String name;
    @Column
    private Integer level;
    @OneToMany(mappedBy = "category")
    private Set<Product> products;
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;
    @OneToMany(mappedBy = "parent")
    private Set<Category> children;
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;
}
