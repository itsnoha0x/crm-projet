package com.crm.points.repository;

import com.crm.points.entity.PointBalance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointBalanceRepository extends JpaRepository<PointBalance, String> {
}
