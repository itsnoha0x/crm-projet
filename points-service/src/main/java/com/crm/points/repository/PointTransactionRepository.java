package com.crm.points.repository;

import com.crm.points.entity.PointTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PointTransactionRepository
        extends JpaRepository<PointTransaction, UUID> {

    Page<PointTransaction> findByCustomerIdOrderByCreatedAtDesc(String customerId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(t.points), 0) FROM PointTransaction t WHERE t.customerId = :customerId")
    int calculateBalanceByCustomerId(@Param("customerId") String customerId);
}