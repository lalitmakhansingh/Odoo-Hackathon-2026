package com.stocksense_backend.delivery.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class CreateDeliveryRequest {

    @NotBlank
    private String deliveryNumber;

    @NotNull
    private UUID createdBy;

    @NotEmpty
    private List<@Valid CreateDeliveryItemRequest> items;

    public String getDeliveryNumber() {
        return deliveryNumber;
    }

    public void setDeliveryNumber(String deliveryNumber) {
        this.deliveryNumber = deliveryNumber;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public List<CreateDeliveryItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreateDeliveryItemRequest> items) {
        this.items = items;
    }
}