package com.crm.customer.exception;
 
public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String id) {
        super("Client introuvable avec l'ID : " + id);
    }
}
