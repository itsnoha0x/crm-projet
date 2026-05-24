package com.crm.loyalty.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCardRequest {

    @NotBlank(message = "customerId obligatoire")
    private String customerId;

    private String cardType;
}