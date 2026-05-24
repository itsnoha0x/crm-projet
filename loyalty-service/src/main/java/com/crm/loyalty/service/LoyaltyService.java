package com.crm.loyalty.service;

import com.crm.loyalty.dto.CreateCardRequest;
import com.crm.loyalty.dto.LoyaltyCardResponse;

public interface LoyaltyService {

    LoyaltyCardResponse createCard(CreateCardRequest request);

    LoyaltyCardResponse getCardByCustomerId(String customerId);

    LoyaltyCardResponse getCardById(String id);

    LoyaltyCardResponse checkAndUpgradeTier(String customerId, int newBalance);

    LoyaltyCardResponse suspendCard(String id);
}
