package com.crm.loyalty.repository;

import com.crm.loyalty.entity.LoyaltyCard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface LoyaltyCardRepository extends JpaRepository<LoyaltyCard, UUID> {

    Optional<LoyaltyCard> findByCustomerId(String customerId);

    boolean existsByCustomerId(String customerId);
}