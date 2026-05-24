package com.crm.customer.service;
 
import com.crm.customer.dto.CustomerRequest;
import com.crm.customer.dto.CustomerResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
 
public interface CustomerService {
    CustomerResponse create(CustomerRequest request);

    CustomerResponse findById(String id);

    Page<CustomerResponse> findAll(Pageable pageable);

    CustomerResponse update(String id, CustomerRequest request);

    void delete(String id);

    CustomerResponse findByEmail(String email);

    Page<CustomerResponse> search(String query, Pageable pageable);
}
