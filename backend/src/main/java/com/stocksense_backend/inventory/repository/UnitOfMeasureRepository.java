package com.stocksense_backend.inventory.repository;

import com.stocksense_backend.inventory.entity.UnitOfMeasure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UnitOfMeasureRepository extends JpaRepository<UnitOfMeasure, UUID> {
}