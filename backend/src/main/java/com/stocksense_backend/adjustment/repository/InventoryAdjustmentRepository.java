package com.stocksense_backend.adjustment.repository;

import com.stocksense_backend.adjustment.entity.InventoryAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InventoryAdjustmentRepository extends JpaRepository<InventoryAdjustment, UUID> {

    Optional<InventoryAdjustment> findByAdjustmentNumber(String adjustmentNumber);
}