package com.review.review_web_backend.entities;

import com.review.review_web_backend.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Entity
@Table(name = "Products")
public class Product extends AbstractEntity<Long> {
    @Column
    private String productName;
    @Column(columnDefinition = "TEXT")
    private String avatar;
    @Column
    private Double cost;
    @Column
    private Double price;
    @Column
    private Instant startDate;
    @Column
    private Instant endDate;
    @Column
    private Status status;
    @Column
    private String description;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

}
