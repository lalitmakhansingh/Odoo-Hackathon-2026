package com.stocksense_backend.warehouse.repository;

import com.stocksense_backend.warehouse.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
}