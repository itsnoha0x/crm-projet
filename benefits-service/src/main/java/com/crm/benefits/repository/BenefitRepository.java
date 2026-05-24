package com.crm.benefits.repository;

import com.crm.benefits.entity.Benefit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BenefitRepository extends JpaRepository<Benefit, java.util.UUID> {
    List<Benefit> findByCardType(String cardType);

    List<Benefit> findByCardTypeAndActiveTrue(String cardType);

    List<Benefit> findByActiveTrue();
}
