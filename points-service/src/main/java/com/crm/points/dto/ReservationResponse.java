package com.crm.points.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ReservationResponse {
    private UUID reservationId;
    private String customerId;
    private Double montantTotal;
    private Integer pointsGagnes;
    private Integer nouveauSolde;
    private String tierActuel;
    private String message;
}
