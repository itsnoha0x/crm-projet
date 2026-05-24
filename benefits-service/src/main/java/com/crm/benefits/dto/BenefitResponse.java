package com.crm.benefits.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BenefitResponse {
    private String id;
    private String cardType;
    private String title;
    private String description;
    private boolean active;
}
