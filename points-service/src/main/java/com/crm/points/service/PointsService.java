package com.crm.points.service;

import com.crm.points.dto.BalanceResponse;
import com.crm.points.dto.EarnPointsRequest;
import com.crm.points.dto.PointsResponse;
import com.crm.points.dto.ReservationRequest;
import com.crm.points.dto.ReservationResponse;
import com.crm.points.dto.RedeemPointsRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PointsService {

    PointsResponse earnPoints(EarnPointsRequest request);

    PointsResponse redeemPoints(RedeemPointsRequest request);

    BalanceResponse getBalance(String customerId);

    Page<PointsResponse> getHistory(String customerId, Pageable pageable);

    ReservationResponse processReservation(ReservationRequest request);

    void initBalance(String customerId);
}
