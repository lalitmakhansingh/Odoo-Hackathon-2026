package com.stocksense_backend.stock.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class StockResponse {

    private UUID id;
    private UUID productId;
    private UUID locationId;
    private BigDecimal quantity;
    private LocalDateTime updatedAt;

    public StockResponse(
            UUID id,
            UUID productId,
            UUID locationId,
            BigDecimal quantity,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.productId = productId;
        this.locationId = locationId;
        this.quantity = quantity;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getProductId() {
        return productId;
    }

    public UUID getLocationId() {
        return locationId;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}