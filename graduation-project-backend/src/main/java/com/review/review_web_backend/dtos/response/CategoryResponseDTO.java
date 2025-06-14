package com.review.review_web_backend.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDTO {
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("managerId")
    private Integer managerId;

    @JsonProperty("manager")
    private String manager;

    @JsonProperty("level")
    private Integer level;

    @JsonProperty("parentId")
    private Integer parentId;
}
