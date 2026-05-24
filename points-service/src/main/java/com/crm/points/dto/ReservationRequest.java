package com.crm.points.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationRequest {

    @NotBlank(message = "customerId obligatoire")
    private String customerId;

    @NotNull(message = "nbNuits obligatoire")
    @Min(value = 1, message = "Le nombre de nuits doit etre >= 1")
    private Integer nbNuits;

    @NotNull(message = "prixNuitEuros obligatoire")
    @DecimalMin(value = "1.0", message = "Le prix par nuit doit etre >= 1")
    private Double prixNuitEuros;

    @NotBlank(message = "typeChambres obligatoire")
    @Pattern(regexp = "SIMPLE|DOUBLE|SUITE", message = "typeChambres doit etre SIMPLE, DOUBLE ou SUITE")
    private String typeChambres;

    @NotNull(message = "dateArrivee obligatoire")
    private LocalDate dateArrivee;
}
