package com.crm.points.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "point_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String loyaltyCardId;

    @Column(nullable = false)
    private Integer points;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    private String reference;
    private String description;

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}