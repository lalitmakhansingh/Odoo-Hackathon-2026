package com.stocksense_backend.warehouse.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class LocationResponse {

    private UUID id;
    private UUID warehouseId;
    private String name;
    private String code;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LocationResponse(
            UUID id,
            UUID warehouseId,
            String name,
            String code,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.warehouseId = warehouseId;
        this.name = name;
        this.code = code;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getWarehouseId() {
        return warehouseId;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}