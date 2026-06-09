package com.crm.points.controller;

import com.crm.points.dto.BalanceResponse;
import com.crm.points.dto.EarnPointsRequest;
import com.crm.points.dto.PointsResponse;
import com.crm.points.dto.ReservationRequest;
import com.crm.points.dto.ReservationResponse;
import com.crm.points.dto.RedeemPointsRequest;
import com.crm.points.service.PointsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointsController {

    private final PointsService service;

    @PostMapping("/earn")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<PointsResponse> earn(
            @Valid @RequestBody EarnPointsRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.earnPoints(request));
    }

    @PostMapping("/redeem")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<PointsResponse> redeem(
            @Valid @RequestBody RedeemPointsRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.redeemPoints(request));
    }

    @GetMapping("/{customerId}/balance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('STAFF')")
    public ResponseEntity<BalanceResponse> balance(
            @PathVariable String customerId) {
        return ResponseEntity.ok(service.getBalance(customerId));
    }

    @GetMapping("/{customerId}/history")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('STAFF')")
    public ResponseEntity<Page<PointsResponse>> history(
            @PathVariable String customerId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.getHistory(customerId, pageable));
    }

    @PostMapping("/reservations")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ReservationResponse> processReservation(
            @Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.processReservation(request));
    }

    @PostMapping("/init/{customerId}")
    public ResponseEntity<Void> initBalance(@PathVariable String customerId) {
        service.initBalance(customerId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
