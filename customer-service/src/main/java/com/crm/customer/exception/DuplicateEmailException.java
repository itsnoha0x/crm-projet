package com.crm.customer.exception;
 
public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String email) {
        super("Un client existe déjà avec l'email : " + email);
    }
}
