package com.crm.loyalty.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "loyalty_cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyCard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String customerId;

    @Column(nullable = false, unique = true)
    private String cardNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType cardType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status;

    private LocalDate issueDate;
    private LocalDate expiryDate;
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        if (issueDate == null) issueDate = LocalDate.now();
        if (expiryDate == null) expiryDate = LocalDate.now().plusYears(3);
        if (status == null) status = CardStatus.ACTIVE;
    }
}