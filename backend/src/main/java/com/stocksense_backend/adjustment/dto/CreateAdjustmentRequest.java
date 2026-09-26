package com.stocksense_backend.adjustment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class CreateAdjustmentRequest {

    @NotBlank
    private String adjustmentNumber;

    @NotNull
    private UUID createdBy;

    @NotEmpty
    private List<@Valid CreateAdjustmentItemRequest> items;

    public String getAdjustmentNumber() {
        return adjustmentNumber;
    }

    public void setAdjustmentNumber(String adjustmentNumber) {
        this.adjustmentNumber = adjustmentNumber;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public List<CreateAdjustmentItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreateAdjustmentItemRequest> items) {
        this.items = items;
    }
}