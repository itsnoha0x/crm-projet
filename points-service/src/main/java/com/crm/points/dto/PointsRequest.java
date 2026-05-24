package com.crm.points.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PointsRequest {

    @NotBlank(message = "customerId obligatoire")
    private String customerId;

    @NotNull(message = "points obligatoire")
    private Integer points;

    @NotBlank(message = "type obligatoire")
    private String transactionType;

    private String description;
}