package com.stocksense_backend.delivery.repository;

import com.stocksense_backend.delivery.entity.DeliveryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DeliveryItemRepository extends JpaRepository<DeliveryItem, UUID> {
}