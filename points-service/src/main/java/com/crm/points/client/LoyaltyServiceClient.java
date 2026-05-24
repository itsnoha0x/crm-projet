package com.crm.points.client;

import com.crm.points.config.FeignConfig;
import com.crm.points.dto.LoyaltyCardDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "loyalty-service", configuration = FeignConfig.class)
public interface LoyaltyServiceClient {

    @GetMapping("/api/loyalty/cards/{id}")
    LoyaltyCardDto getCardById(@PathVariable("id") String id);

    @GetMapping("/api/loyalty/cards/customer/{customerId}")
    LoyaltyCardDto getCardByCustomerId(@PathVariable("customerId") String customerId);

    @PutMapping("/api/loyalty/cards/customer/{customerId}/check-upgrade")
    LoyaltyCardDto checkAndUpgradeTier(@PathVariable("customerId") String customerId,
                                       @RequestParam("balance") int balance);
}
