package com.crm.loyalty.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class LoyaltyCardResponse {

    private String id;
    private String customerId;
    private String cardNumber;
    private String cardType;
    private String status;
    private LocalDate issueDate;
    private LocalDate expiryDate;
}