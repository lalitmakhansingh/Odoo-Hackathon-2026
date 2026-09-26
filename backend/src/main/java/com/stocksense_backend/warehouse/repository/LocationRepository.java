package com.stocksense_backend.warehouse.repository;

import com.stocksense_backend.warehouse.entity.Location;
import com.stocksense_backend.warehouse.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {

    List<Location> findByWarehouseId(UUID warehouseId);

    Optional<Location> findByWarehouseAndCode(
            Warehouse warehouse,
            String code
    );
}