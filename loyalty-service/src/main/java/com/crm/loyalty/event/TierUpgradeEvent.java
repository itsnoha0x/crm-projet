package com.crm.loyalty.event;

import java.time.LocalDateTime;

public record TierUpgradeEvent(
    String customerId,
    String customerEmail,
    String ancienTier,
    String nouveauTier,
    int pointsActuels,
    LocalDateTime timestamp
) {
}
