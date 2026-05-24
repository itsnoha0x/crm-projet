package com.crm.customer.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "points-service")
public interface PointsServiceClient {

    @PostMapping("/api/points/init/{customerId}")
    void initBalance(@PathVariable String customerId);
}
