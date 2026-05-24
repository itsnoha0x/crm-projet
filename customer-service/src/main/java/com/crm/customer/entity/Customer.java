package com.crm.customer.entity;
 
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;
 
@Entity
@Table(name = "customers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
 
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
 
    @Column(nullable = false)
    private String firstName;
 
    @Column(nullable = false)
    private String lastName;
 
    @Column(unique = true, nullable = false)
    private String email;
 
    private String phone;
    private String address;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerStatus status;
 
    @Column(updatable = false)
    private LocalDateTime createdAt;
 
    private LocalDateTime updatedAt;
 
    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (status == null) status = CustomerStatus.ACTIVE;
    }
 
    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }
}
