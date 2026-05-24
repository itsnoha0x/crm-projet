package com.crm.points.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RedeemPointsRequest {

    @NotBlank(message = "customerId obligatoire")
    private String customerId;

    @NotBlank(message = "loyaltyCardId obligatoire")
    private String loyaltyCardId;

    @NotNull(message = "points obligatoire")
    @Min(value = 1, message = "Les points doivent être supérieurs à 0")
    private Integer points;

    private String reference;
    private String description;
}
