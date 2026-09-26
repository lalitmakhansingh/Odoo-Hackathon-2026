package com.stocksense_backend.transfer.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class CreateTransferRequest {

    @NotBlank
    private String transferNumber;

    @NotNull
    private UUID createdBy;

    @NotEmpty
    private List<@Valid CreateTransferItemRequest> items;

    public String getTransferNumber() {
        return transferNumber;
    }

    public void setTransferNumber(String transferNumber) {
        this.transferNumber = transferNumber;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public List<CreateTransferItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreateTransferItemRequest> items) {
        this.items = items;
    }
}