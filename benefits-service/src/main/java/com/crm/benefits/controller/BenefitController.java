package com.crm.benefits.controller;

import com.crm.benefits.dto.BenefitResponse;
import com.crm.benefits.service.BenefitServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/benefits")
@RequiredArgsConstructor
public class BenefitController {

    private final BenefitServiceImpl service;

    @GetMapping("/{cardType}")
    public ResponseEntity<List<BenefitResponse>> getByCardType(
            @PathVariable String cardType) {
        return ResponseEntity.ok(service.getBenefitsByCardType(cardType));
    }

    @GetMapping
    public ResponseEntity<List<BenefitResponse>> getAll() {
        return ResponseEntity.ok(service.getAllBenefits());
    }
}
