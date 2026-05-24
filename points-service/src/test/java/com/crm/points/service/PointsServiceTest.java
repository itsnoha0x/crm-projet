package com.crm.points.service;

import com.crm.points.client.LoyaltyServiceClient;
import com.crm.points.dto.EarnPointsRequest;
import com.crm.points.dto.LoyaltyCardDto;
import com.crm.points.dto.RedeemPointsRequest;
import com.crm.points.entity.PointBalance;
import com.crm.points.entity.PointTransaction;
import com.crm.points.repository.PointBalanceRepository;
import com.crm.points.repository.PointTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PointsServiceTest {

    @Mock
    private PointTransactionRepository transactionRepository;

    @Mock
    private PointBalanceRepository balanceRepository;

    @Mock
    private LoyaltyServiceClient loyaltyServiceClient;

    @InjectMocks
    private PointsServiceImpl pointsService;

    private static final String CUSTOMER_ID = "cust-001";
    private static final String CARD_ID = "card-001";

    @BeforeEach
    void setUp() {
        when(transactionRepository.save(any(PointTransaction.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void earnPoints_Silver_AppliesMultiplier1() {
        EarnPointsRequest request = earnRequest(100);
        LoyaltyCardDto card = cardWithType("SILVER");

        when(loyaltyServiceClient.getCardById(CARD_ID)).thenReturn(card);
        when(balanceRepository.findById(CUSTOMER_ID)).thenReturn(Optional.empty());
        when(balanceRepository.save(any(PointBalance.class))).thenAnswer(invocation -> invocation.getArgument(0));

        pointsService.earnPoints(request);

        ArgumentCaptor<PointBalance> balanceCaptor = ArgumentCaptor.forClass(PointBalance.class);
        verify(balanceRepository).save(balanceCaptor.capture());
        assertEquals(100, balanceCaptor.getValue().getCurrentBalance());

        ArgumentCaptor<PointTransaction> txCaptor = ArgumentCaptor.forClass(PointTransaction.class);
        verify(transactionRepository).save(txCaptor.capture());
        assertEquals(100, txCaptor.getValue().getPoints());
    }

    @Test
    void earnPoints_Gold_AppliesMultiplier1_5() {
        EarnPointsRequest request = earnRequest(100);
        LoyaltyCardDto card = cardWithType("GOLD");

        when(loyaltyServiceClient.getCardById(CARD_ID)).thenReturn(card);
        when(balanceRepository.findById(CUSTOMER_ID)).thenReturn(Optional.empty());
        when(balanceRepository.save(any(PointBalance.class))).thenAnswer(invocation -> invocation.getArgument(0));

        pointsService.earnPoints(request);

        ArgumentCaptor<PointTransaction> txCaptor = ArgumentCaptor.forClass(PointTransaction.class);
        verify(transactionRepository).save(txCaptor.capture());
        assertEquals(150, txCaptor.getValue().getPoints());
    }

    @Test
    void earnPoints_Platinum_AppliesMultiplier2() {
        EarnPointsRequest request = earnRequest(100);
        LoyaltyCardDto card = cardWithType("PLATINUM");

        when(loyaltyServiceClient.getCardById(CARD_ID)).thenReturn(card);
        when(balanceRepository.findById(CUSTOMER_ID)).thenReturn(Optional.empty());
        when(balanceRepository.save(any(PointBalance.class))).thenAnswer(invocation -> invocation.getArgument(0));

        pointsService.earnPoints(request);

        ArgumentCaptor<PointTransaction> txCaptor = ArgumentCaptor.forClass(PointTransaction.class);
        verify(transactionRepository).save(txCaptor.capture());
        assertEquals(200, txCaptor.getValue().getPoints());
    }

    @Test
    void redeemPoints_SufficientBalance_Success() {
        RedeemPointsRequest request = redeemRequest(50);
        PointBalance balance = PointBalance.builder()
            .customerId(CUSTOMER_ID)
            .currentBalance(200)
            .totalEarned(200)
            .totalRedeemed(0)
            .build();

        when(balanceRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(balance));
        when(balanceRepository.save(any(PointBalance.class))).thenAnswer(invocation -> invocation.getArgument(0));

        pointsService.redeemPoints(request);

        assertEquals(150, balance.getCurrentBalance());
        assertEquals(50, balance.getTotalRedeemed());
        verify(transactionRepository).save(any(PointTransaction.class));
    }

    @Test
    void redeemPoints_InsufficientBalance_ThrowsException() {
        RedeemPointsRequest request = redeemRequest(100);
        PointBalance balance = PointBalance.builder()
            .customerId(CUSTOMER_ID)
            .currentBalance(50)
            .totalEarned(50)
            .totalRedeemed(0)
            .build();

        when(balanceRepository.findById(CUSTOMER_ID)).thenReturn(Optional.of(balance));

        assertThrows(IllegalStateException.class, () -> pointsService.redeemPoints(request));
        verify(transactionRepository, never()).save(any());
    }

    private EarnPointsRequest earnRequest(int points) {
        EarnPointsRequest request = new EarnPointsRequest();
        request.setCustomerId(CUSTOMER_ID);
        request.setLoyaltyCardId(CARD_ID);
        request.setPoints(points);
        return request;
    }

    private RedeemPointsRequest redeemRequest(int points) {
        RedeemPointsRequest request = new RedeemPointsRequest();
        request.setCustomerId(CUSTOMER_ID);
        request.setLoyaltyCardId(CARD_ID);
        request.setPoints(points);
        return request;
    }

    private LoyaltyCardDto cardWithType(String cardType) {
        return LoyaltyCardDto.builder()
            .id(CARD_ID)
            .customerId(CUSTOMER_ID)
            .cardType(cardType)
            .build();
    }
}
