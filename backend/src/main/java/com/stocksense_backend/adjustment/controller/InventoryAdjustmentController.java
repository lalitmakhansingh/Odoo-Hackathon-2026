package com.stocksense_backend.adjustment.controller;

import com.stocksense_backend.adjustment.dto.CreateAdjustmentRequest;
import com.stocksense_backend.adjustment.entity.InventoryAdjustment;
import com.stocksense_backend.adjustment.service.InventoryAdjustmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/adjustments")
public class InventoryAdjustmentController {

    private final InventoryAdjustmentService adjustmentService;

    public InventoryAdjustmentController(
            InventoryAdjustmentService adjustmentService) {
        this.adjustmentService = adjustmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryAdjustment createAdjustment(
            @Valid @RequestBody CreateAdjustmentRequest request) {

        return adjustmentService.createAdjustment(request);
    }

    @GetMapping
    public List<InventoryAdjustment> getAllAdjustments() {
        return adjustmentService.getAllAdjustments();
    }

    @GetMapping("/{id}")
    public InventoryAdjustment getAdjustment(@PathVariable UUID id) {
        return adjustmentService.getAdjustment(id);
    }

    @PostMapping("/{id}/validate")
    public InventoryAdjustment validateAdjustment(
            @PathVariable UUID id) {

        return adjustmentService.validateAdjustment(id);
    }
}