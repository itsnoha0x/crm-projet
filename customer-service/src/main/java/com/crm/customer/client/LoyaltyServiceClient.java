package com.crm.customer.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "loyalty-service")
public interface LoyaltyServiceClient {

    @PostMapping("/api/loyalty/cards")
    void createCard(@RequestBody CreateCardRequest request);
}
