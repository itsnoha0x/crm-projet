package com.crm.points.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "point_balances")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointBalance {

    @Id
    private String customerId;

    @Column(nullable = false)
    private Integer currentBalance;

    @Column(nullable = false)
    private Integer totalEarned;

    @Column(nullable = false)
    private Integer totalRedeemed;

    private LocalDateTime lastUpdated;

    @PrePersist
    void onCreate() {
        if (currentBalance == null) currentBalance = 0;
        if (totalEarned == null) totalEarned = 0;
        if (totalRedeemed == null) totalRedeemed = 0;
        if (lastUpdated == null) lastUpdated = LocalDateTime.now();
    }

    public void updateLastUpdated() {
        lastUpdated = LocalDateTime.now();
    }
}
