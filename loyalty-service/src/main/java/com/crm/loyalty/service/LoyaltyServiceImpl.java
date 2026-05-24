package com.crm.loyalty.service;

import com.crm.loyalty.config.RabbitMQConfig;
import com.crm.loyalty.dto.CreateCardRequest;
import com.crm.loyalty.dto.LoyaltyCardResponse;
import com.crm.loyalty.entity.CardStatus;
import com.crm.loyalty.entity.CardType;
import com.crm.loyalty.entity.LoyaltyCard;
import com.crm.loyalty.event.TierUpgradeEvent;
import com.crm.loyalty.repository.LoyaltyCardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class LoyaltyServiceImpl implements LoyaltyService {

    private final LoyaltyCardRepository repo;
    private final RabbitTemplate rabbitTemplate;

    private static final int SILVER_TO_GOLD_THRESHOLD   = 1_000;
    private static final int GOLD_TO_PLATINUM_THRESHOLD = 5_000;

    @Override
    public LoyaltyCardResponse createCard(CreateCardRequest request) {
        if (repo.existsByCustomerId(request.getCustomerId())) {
            throw new RuntimeException("Le client a déjà une carte de fidélité");
        }
        CardType type = request.getCardType() != null
            ? CardType.valueOf(request.getCardType())
            : CardType.SILVER;

        LoyaltyCard card = LoyaltyCard.builder()
            .customerId(request.getCustomerId())
            .cardType(type)
            .cardNumber(generateCardNumber(type))
            .build();

        return toResponse(repo.save(card));
    }

    @Override
    @Transactional(readOnly = true)
    public LoyaltyCardResponse getCardByCustomerId(String customerId) {
        return repo.findByCustomerId(customerId)
            .map(this::toResponse)
            .orElseThrow(() -> new RuntimeException("Carte introuvable pour customerId: " + customerId));
    }

    @Override
    @Transactional(readOnly = true)
    public LoyaltyCardResponse getCardById(String id) {
        return repo.findById(UUID.fromString(id))
            .map(this::toResponse)
            .orElseThrow(() -> new RuntimeException("Carte introuvable avec id: " + id));
    }

    @Override
    public LoyaltyCardResponse checkAndUpgradeTier(String customerId, int newBalance) {
        LoyaltyCard card = repo.findByCustomerId(customerId)
            .orElseThrow(() -> new RuntimeException("Carte introuvable"));

        CardType current = card.getCardType();
        CardType newType = determineCardType(newBalance);

        if (newType != current) {
            card.setCardType(newType);
            card.setCardNumber(generateCardNumber(newType));
            repo.save(card);

            rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.KEY,
                new TierUpgradeEvent(
                    customerId,
                    "unknown@luxstay.com",
                    current.name(),
                    newType.name(),
                    newBalance,
                    LocalDateTime.now()
                )
            );
            log.info("[TIER_UPGRADE] {} → {} pour customerId={}", current, newType, customerId);
        }
        return toResponse(card);
    }

    @Override
    public LoyaltyCardResponse suspendCard(String id) {
        LoyaltyCard card = repo.findById(UUID.fromString(id))
            .orElseThrow(() -> new RuntimeException("Carte introuvable"));
        card.setStatus(CardStatus.SUSPENDED);
        return toResponse(repo.save(card));
    }

    private CardType determineCardType(int balance) {
        if (balance >= GOLD_TO_PLATINUM_THRESHOLD) return CardType.PLATINUM;
        if (balance >= SILVER_TO_GOLD_THRESHOLD)   return CardType.GOLD;
        return CardType.SILVER;
    }

    private String generateCardNumber(CardType type) {
        long count = repo.count() + 1;
        return String.format("CRM-%s-%06d", type.name(), count);
    }

    private LoyaltyCardResponse toResponse(LoyaltyCard card) {
        return LoyaltyCardResponse.builder()
            .id(card.getId() != null ? card.getId().toString() : null)
            .customerId(card.getCustomerId())
            .cardNumber(card.getCardNumber())
            .cardType(card.getCardType().name())
            .status(card.getStatus().name())
            .issueDate(card.getIssueDate())
            .expiryDate(card.getExpiryDate())
            .build();
    }
}
