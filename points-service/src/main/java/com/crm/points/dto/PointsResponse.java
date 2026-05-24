package com.crm.points.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PointsResponse {

    private String id;
    private String customerId;
    private String loyaltyCardId;
    private Integer points;
    private String transactionType;
    private String reference;
    private String description;
    private LocalDateTime createdAt;
}
