package com.stocksense_backend.ledger.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class StockMoveResponse {

    private UUID id;
    private UUID productId;
    private UUID locationId;
    private BigDecimal quantity;
    private String moveType;
    private UUID referenceId;
    private LocalDateTime createdAt;

    public StockMoveResponse(
            UUID id,
            UUID productId,
            UUID locationId,
            BigDecimal quantity,
            String moveType,
            UUID referenceId,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.productId = productId;
        this.locationId = locationId;
        this.quantity = quantity;
        this.moveType = moveType;
        this.referenceId = referenceId;
        this.createdAt = createdAt;
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

    public String getMoveType() {
        return moveType;
    }

    public UUID getReferenceId() {
        return referenceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
