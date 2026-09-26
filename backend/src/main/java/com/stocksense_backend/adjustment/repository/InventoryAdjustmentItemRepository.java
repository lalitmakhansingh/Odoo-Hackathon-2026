package com.stocksense_backend.adjustment.repository;

import com.stocksense_backend.adjustment.entity.InventoryAdjustmentItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InventoryAdjustmentItemRepository extends JpaRepository<InventoryAdjustmentItem, UUID> {
}