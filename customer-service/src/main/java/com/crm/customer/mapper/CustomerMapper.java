package com.crm.customer.mapper;
 
import com.crm.customer.dto.CustomerRequest;
import com.crm.customer.dto.CustomerResponse;
import com.crm.customer.entity.Customer;
import com.crm.customer.entity.CustomerStatus;
import org.springframework.stereotype.Component;
 
@Component
public class CustomerMapper {
 
    public Customer toEntity(CustomerRequest request) {
        return Customer.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .address(request.getAddress())
            .status(CustomerStatus.ACTIVE)
            .build();
    }
 
    public CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
            .id(customer.getId() != null ? customer.getId().toString() : null)
            .firstName(customer.getFirstName())
            .lastName(customer.getLastName())
            .email(customer.getEmail())
            .phone(customer.getPhone())
            .address(customer.getAddress())
            .status(customer.getStatus().name())
            .createdAt(customer.getCreatedAt())
            .updatedAt(customer.getUpdatedAt())
            .build();
    }
}
