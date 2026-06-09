package com.crm.loyalty.controller;

import com.crm.loyalty.dto.CreateCardRequest;
import com.crm.loyalty.dto.LoyaltyCardResponse;
import com.crm.loyalty.service.LoyaltyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loyalty/cards")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    @PostMapping
    public ResponseEntity<LoyaltyCardResponse> createCard(
            @Valid @RequestBody CreateCardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(loyaltyService.createCard(request));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('STAFF')")
    public ResponseEntity<LoyaltyCardResponse> getByCustomer(
            @PathVariable String customerId) {
        return ResponseEntity.ok(loyaltyService.getCardByCustomerId(customerId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('STAFF')")
    public ResponseEntity<LoyaltyCardResponse> getById(
            @PathVariable String id) {
        return ResponseEntity.ok(loyaltyService.getCardById(id));
    }

    @PutMapping("/customer/{customerId}/check-upgrade")
    public ResponseEntity<LoyaltyCardResponse> checkUpgrade(
            @PathVariable String customerId,
            @RequestParam int balance) {
        return ResponseEntity.ok(loyaltyService.checkAndUpgradeTier(customerId, balance));
    }

    @PutMapping("/{id}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoyaltyCardResponse> suspend(@PathVariable String id) {
        return ResponseEntity.ok(loyaltyService.suspendCard(id));
    }
}
