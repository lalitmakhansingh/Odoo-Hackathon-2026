package com.stocksense_backend.receipt.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class CreateReceiptRequest {

    @NotBlank
    private String receiptNumber;

    @NotNull
    private UUID createdBy;

    @NotEmpty
private List<@Valid CreateReceiptItemRequest> items;

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public List<CreateReceiptItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreateReceiptItemRequest> items) {
        this.items = items;
    }
}