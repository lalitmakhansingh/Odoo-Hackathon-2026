package com.stocksense_backend.warehouse.controller;

import com.stocksense_backend.warehouse.dto.WarehouseRequest;
import com.stocksense_backend.warehouse.entity.Warehouse;
import com.stocksense_backend.warehouse.service.WarehouseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping
    public List<Warehouse> getAllWarehouses() {
        return warehouseService.getAllWarehouses();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Warehouse createWarehouse(
            @Valid @RequestBody WarehouseRequest request) {

        return warehouseService.createWarehouse(request);
    }

    @PutMapping("/{id}")
    public Warehouse updateWarehouse(
            @PathVariable UUID id,
            @Valid @RequestBody WarehouseRequest request) {

        return warehouseService.updateWarehouse(id, request);
    }
}