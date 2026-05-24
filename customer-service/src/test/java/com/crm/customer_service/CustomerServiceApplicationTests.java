package com.crm.customer_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import com.crm.customer.CustomerServiceApplication;

@SpringBootTest(classes = CustomerServiceApplication.class)
@ActiveProfiles("test")
class CustomerServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
