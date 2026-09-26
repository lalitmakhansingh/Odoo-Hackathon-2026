package com.stocksense_backend.adjustment.repository;

import com.stocksense_backend.adjustment.entity.InventoryAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InventoryAdjustmentRepository extends JpaRepository<InventoryAdjustment, UUID> {
}