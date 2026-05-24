package com.crm.customer.dto;
 
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
 
@Data
@Builder
public class CustomerResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
