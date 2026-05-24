package com.crm.points.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoyaltyCardDto {
    private String id;
    private String customerId;
    private String cardType;
    private String status;
}
