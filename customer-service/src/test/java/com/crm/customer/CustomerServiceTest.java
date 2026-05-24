package com.crm.customer;

import com.crm.customer.dto.CustomerRequest;
import com.crm.customer.dto.CustomerResponse;
import com.crm.customer.entity.Customer;
import com.crm.customer.entity.CustomerStatus;
import com.crm.customer.exception.CustomerNotFoundException;
import com.crm.customer.exception.DuplicateEmailException;
import com.crm.customer.mapper.CustomerMapper;
import com.crm.customer.repository.CustomerRepository;
import com.crm.customer.service.CustomerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private Customer customer;
    private CustomerRequest request;
    private CustomerResponse response;
    private String customerId;

    @BeforeEach
    void setUp() {
        customerId = UUID.randomUUID().toString();
        customer = new Customer();
        customer.setId(UUID.fromString(customerId));
        customer.setFirstName("Ahmed");
        customer.setLastName("Benali");
        customer.setEmail("ahmed@test.com");
        customer.setStatus(CustomerStatus.ACTIVE);

        request = new CustomerRequest();
        request.setFirstName("Ahmed");
        request.setLastName("Benali");
        request.setEmail("ahmed@test.com");

        response = CustomerResponse.builder()
            .id(customerId)
            .firstName("Ahmed")
            .lastName("Benali")
            .email("ahmed@test.com")
            .build();
    }

    @Test
    void createCustomer_Success() {
        when(customerRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(customerMapper.toEntity(request)).thenReturn(customer);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(customerMapper.toResponse(customer)).thenReturn(response);

        CustomerResponse result = customerService.create(request);

        assertNotNull(result);
        assertEquals("Ahmed", result.getFirstName());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void createCustomer_DuplicateEmail_ThrowsException() {
        when(customerRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> customerService.create(request));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void findById_Success() {
        when(customerRepository.findById(UUID.fromString(customerId)))
            .thenReturn(Optional.of(customer));
        when(customerMapper.toResponse(customer)).thenReturn(response);

        CustomerResponse result = customerService.findById(customerId);

        assertNotNull(result);
        assertEquals(customerId, result.getId());
    }

    @Test
    void findById_NotFound_ThrowsException() {
        String missingId = UUID.randomUUID().toString();
        when(customerRepository.findById(UUID.fromString(missingId)))
            .thenReturn(Optional.empty());

        assertThrows(CustomerNotFoundException.class,
            () -> customerService.findById(missingId));
    }

    @Test
    void deleteCustomer_Success() {
        when(customerRepository.findById(UUID.fromString(customerId)))
            .thenReturn(Optional.of(customer));
        when(customerRepository.save(customer)).thenReturn(customer);

        customerService.delete(customerId);

        assertEquals(CustomerStatus.INACTIVE, customer.getStatus());
        verify(customerRepository, times(1)).save(customer);
    }
}
