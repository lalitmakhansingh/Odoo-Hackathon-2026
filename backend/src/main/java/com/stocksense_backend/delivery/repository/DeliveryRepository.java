package com.stocksense_backend.delivery.repository;

import com.stocksense_backend.delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
}