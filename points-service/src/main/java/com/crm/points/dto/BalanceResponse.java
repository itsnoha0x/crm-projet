package com.crm.points.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BalanceResponse {

    private String customerId;
    private Integer currentBalance;
    private Integer totalEarned;
    private Integer totalRedeemed;
    private LocalDateTime lastUpdated;
}
