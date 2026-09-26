package com.stocksense_backend.stock.repository;

import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.stock.entity.Stock;
import com.stocksense_backend.warehouse.entity.Location;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StockRepository extends JpaRepository<Stock, UUID> {

    Optional<Stock> findByProductAndLocation(
            Product product,
            Location location
    );

    Optional<Stock> findByProductIdAndLocationId(
            UUID productId,
            UUID locationId
    );

    List<Stock> findByProductId(UUID productId);

    List<Stock> findByLocationId(UUID locationId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Stock> findWithLockByProductIdAndLocationId(
            UUID productId,
            UUID locationId
    );
}