package com.crm.customer.service;
 
import com.crm.customer.dto.CustomerRequest;
import com.crm.customer.dto.CustomerResponse;
import com.crm.customer.client.CreateCardRequest;
import com.crm.customer.client.LoyaltyServiceClient;
import com.crm.customer.client.PointsServiceClient;
import com.crm.customer.entity.Customer;
import com.crm.customer.entity.CustomerStatus;
import com.crm.customer.exception.CustomerNotFoundException;
import com.crm.customer.exception.DuplicateEmailException;
import com.crm.customer.mapper.CustomerMapper;
import com.crm.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
 
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CustomerServiceImpl implements CustomerService {
 
    private final CustomerRepository repo;
    private final CustomerMapper mapper;
    private final LoyaltyServiceClient loyaltyServiceClient;
    private final PointsServiceClient pointsServiceClient;
 
    @Override
    public CustomerResponse create(CustomerRequest request) {
        log.info("[CREATE_CUSTOMER] email={}", request.getEmail());
        if (repo.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }
        Customer customer = mapper.toEntity(request);
        Customer saved = repo.save(customer);
        CreateCardRequest createCardRequest = new CreateCardRequest();
        createCardRequest.setCustomerId(saved.getId().toString());
        createCardRequest.setCardType("SILVER");
        loyaltyServiceClient.createCard(createCardRequest);
        pointsServiceClient.initBalance(saved.getId().toString());
        log.info("[CREATE_CUSTOMER] success id={}", saved.getId());
        return mapper.toResponse(saved);
    }
 
    @Override
    @Transactional(readOnly = true)
    public CustomerResponse findById(String id) {
        return repo.findById(UUID.fromString(id))
            .map(mapper::toResponse)
            .orElseThrow(() -> new CustomerNotFoundException(id));
    }
 
    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> findAll(Pageable pageable) {
        return repo.findAll(pageable).map(mapper::toResponse);
    }
 
    @Override
    public CustomerResponse update(String id, CustomerRequest request) {
        Customer customer = repo.findById(UUID.fromString(id))
            .orElseThrow(() -> new CustomerNotFoundException(id));
 
        if (!customer.getEmail().equalsIgnoreCase(request.getEmail()) && repo.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }
 
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        return mapper.toResponse(repo.save(customer));
    }
 
    @Override
    public void delete(String id) {
        Customer customer = repo.findById(UUID.fromString(id))
            .orElseThrow(() -> new CustomerNotFoundException(id));
        customer.setStatus(CustomerStatus.INACTIVE); // Soft-delete
        repo.save(customer);
        log.info("[DELETE_CUSTOMER] soft-deleted id={}", id);
    }
 
    @Override
    @Transactional(readOnly = true)
    public CustomerResponse findByEmail(String email) {
        return repo.findByEmail(email)
            .map(mapper::toResponse)
            .orElseThrow(() -> new CustomerNotFoundException(email));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> search(String query, Pageable pageable) {
        return repo.search(query, pageable).map(mapper::toResponse);
    }
}
