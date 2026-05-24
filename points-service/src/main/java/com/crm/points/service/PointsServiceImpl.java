package com.crm.points.service;

import com.crm.points.client.LoyaltyServiceClient;
import com.crm.points.dto.BalanceResponse;
import com.crm.points.dto.EarnPointsRequest;
import com.crm.points.dto.LoyaltyCardDto;
import com.crm.points.dto.PointsResponse;
import com.crm.points.dto.ReservationRequest;
import com.crm.points.dto.ReservationResponse;
import com.crm.points.dto.RedeemPointsRequest;
import com.crm.points.entity.PointBalance;
import com.crm.points.entity.PointTransaction;
import com.crm.points.entity.TransactionType;
import com.crm.points.repository.PointBalanceRepository;
import com.crm.points.repository.PointTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PointsServiceImpl implements PointsService {

    private final PointTransactionRepository transactionRepository;
    private final PointBalanceRepository balanceRepository;
    private final LoyaltyServiceClient loyaltyServiceClient;

    @Override
    public PointsResponse earnPoints(EarnPointsRequest request) {
        LoyaltyCardDto card = loyaltyServiceClient.getCardById(request.getLoyaltyCardId());
        double multiplier = getMultiplier(card.getCardType());
        int earned = (int) Math.max(1, Math.ceil(request.getPoints() * multiplier));

        PointBalance balance = balanceRepository.findById(request.getCustomerId())
            .orElse(PointBalance.builder()
                .customerId(request.getCustomerId())
                .currentBalance(0)
                .totalEarned(0)
                .totalRedeemed(0)
                .build());

        balance.setCurrentBalance(balance.getCurrentBalance() + earned);
        balance.setTotalEarned(balance.getTotalEarned() + earned);
        balance.updateLastUpdated();
        balanceRepository.save(balance);

        PointTransaction transaction = PointTransaction.builder()
            .customerId(request.getCustomerId())
            .loyaltyCardId(request.getLoyaltyCardId())
            .points(earned)
            .type(TransactionType.EARNED)
            .reference(request.getReference())
            .description(request.getDescription())
            .build();

        transactionRepository.save(transaction);
        loyaltyServiceClient.checkAndUpgradeTier(request.getCustomerId(), balance.getCurrentBalance());

        log.info("[EARN] customer={} loyaltyCard={} points={} multiplier={}", request.getCustomerId(), request.getLoyaltyCardId(), earned, multiplier);
        return toResponse(transaction);
    }

    @Override
    public PointsResponse redeemPoints(RedeemPointsRequest request) {
        PointBalance balance = balanceRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new IllegalStateException("Solde indisponible pour le client"));

        if (balance.getCurrentBalance() < request.getPoints()) {
            throw new IllegalStateException("Points insuffisants pour la transaction");
        }

        balance.setCurrentBalance(balance.getCurrentBalance() - request.getPoints());
        balance.setTotalRedeemed(balance.getTotalRedeemed() + request.getPoints());
        balance.updateLastUpdated();
        balanceRepository.save(balance);

        PointTransaction transaction = PointTransaction.builder()
            .customerId(request.getCustomerId())
            .loyaltyCardId(request.getLoyaltyCardId())
            .points(-request.getPoints())
            .type(TransactionType.REDEEMED)
            .reference(request.getReference())
            .description(request.getDescription())
            .build();

        transactionRepository.save(transaction);

        log.info("[REDEEM] customer={} loyaltyCard={} points={}", request.getCustomerId(), request.getLoyaltyCardId(), request.getPoints());
        return toResponse(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public BalanceResponse getBalance(String customerId) {
        PointBalance balance = balanceRepository.findById(customerId)
            .orElse(PointBalance.builder()
                .customerId(customerId)
                .currentBalance(0)
                .totalEarned(0)
                .totalRedeemed(0)
                .build());

        return BalanceResponse.builder()
            .customerId(balance.getCustomerId())
            .currentBalance(balance.getCurrentBalance())
            .totalEarned(balance.getTotalEarned())
            .totalRedeemed(balance.getTotalRedeemed())
            .lastUpdated(balance.getLastUpdated())
            .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PointsResponse> getHistory(String customerId, Pageable pageable) {
        return transactionRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
            .map(this::toResponse);
    }

    @Override
    public ReservationResponse processReservation(ReservationRequest request) {
        LoyaltyCardDto card = loyaltyServiceClient.getCardByCustomerId(request.getCustomerId());

        double montantTotal = request.getNbNuits() * request.getPrixNuitEuros();
        int pointsDeBase = (int) Math.ceil(montantTotal);
        double multiplier = getMultiplier(card.getCardType());
        int pointsGagnes = (int) Math.ceil(pointsDeBase * multiplier);

        EarnPointsRequest earnPointsRequest = new EarnPointsRequest();
        earnPointsRequest.setCustomerId(request.getCustomerId());
        earnPointsRequest.setLoyaltyCardId(card.getId());
        earnPointsRequest.setPoints(pointsDeBase);
        earnPointsRequest.setReference("RES-" + UUID.randomUUID());
        earnPointsRequest.setDescription("Sejour " + request.getNbNuits() + " nuit(s), chambre " + request.getTypeChambres());

        earnPoints(earnPointsRequest);
        LoyaltyCardDto upgradedCard = loyaltyServiceClient.getCardByCustomerId(request.getCustomerId());
        BalanceResponse updatedBalance = getBalance(request.getCustomerId());

        return ReservationResponse.builder()
            .reservationId(UUID.randomUUID())
            .customerId(request.getCustomerId())
            .montantTotal(montantTotal)
            .pointsGagnes(pointsGagnes)
            .nouveauSolde(updatedBalance.getCurrentBalance())
            .tierActuel(upgradedCard.getCardType())
            .message("Reservation enregistree. Points credites avec succes.")
            .build();
    }

    @Override
    public void initBalance(String customerId) {
        balanceRepository.findById(customerId).orElseGet(() -> {
            PointBalance balance = PointBalance.builder()
                .customerId(customerId)
                .currentBalance(0)
                .totalEarned(0)
                .totalRedeemed(0)
                .build();
            return balanceRepository.save(balance);
        });
    }

    private double getMultiplier(String cardType) {
        return switch (cardType) {
            case "GOLD" -> 1.5;
            case "PLATINUM" -> 2.0;
            default -> 1.0;
        };
    }

    private PointsResponse toResponse(PointTransaction transaction) {
        return PointsResponse.builder()
            .id(transaction.getId() != null ? transaction.getId().toString() : null)
            .customerId(transaction.getCustomerId())
            .loyaltyCardId(transaction.getLoyaltyCardId())
            .points(transaction.getPoints())
            .transactionType(transaction.getType().name())
            .reference(transaction.getReference())
            .description(transaction.getDescription())
            .createdAt(transaction.getCreatedAt())
            .build();
    }
}
