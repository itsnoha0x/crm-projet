package com.crm.benefits.service;

import com.crm.benefits.dto.BenefitResponse;
import com.crm.benefits.entity.Benefit;
import com.crm.benefits.repository.BenefitRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BenefitServiceImpl {

    private final BenefitRepository repository;

    @PostConstruct
    public void initDefaultBenefits() {
        if (repository.count() > 0) {
            return;
        }

        repository.saveAll(List.of(
            Benefit.builder()
                .cardType("SILVER")
                .title("5% discount")
                .description("5% discount on all loyalty purchases.")
                .active(true)
                .build(),
            Benefit.builder()
                .cardType("GOLD")
                .title("10% discount")
                .description("10% discount plus priority support.")
                .active(true)
                .build(),
            Benefit.builder()
                .cardType("PLATINUM")
                .title("20% discount")
                .description("20% discount plus free gift wrapping and VIP service.")
                .active(true)
                .build()
        ));
    }

    public List<BenefitResponse> getBenefitsByCardType(String cardType) {
        return repository.findByCardType(cardType.toUpperCase())
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<BenefitResponse> getAllBenefits() {
        return repository.findByActiveTrue()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    private BenefitResponse toResponse(Benefit benefit) {
        return BenefitResponse.builder()
            .id(benefit.getId() != null ? benefit.getId().toString() : null)
            .cardType(benefit.getCardType())
            .title(benefit.getTitle())
            .description(benefit.getDescription())
            .active(benefit.isActive())
            .build();
    }
}
