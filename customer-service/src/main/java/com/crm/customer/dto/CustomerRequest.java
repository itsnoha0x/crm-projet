package com.crm.customer.dto;
 
import jakarta.validation.constraints.*;
import lombok.Data;
 
@Data
public class CustomerRequest {
 
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 100)
    private String firstName;
 
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 100)
    private String lastName;
 
    @NotBlank
    @Email(message = "L'email doit être valide")
    private String email;
 
    @Pattern(regexp = "^\\+?[1-9]\\d{7,14}$", message = "Téléphone invalide")
    private String phone;
 
    private String address;
}
