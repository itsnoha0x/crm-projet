package com.crm.customer.client;

import lombok.Data;

@Data
public class CreateCardRequest {
    private String customerId;
    private String cardType;
}
