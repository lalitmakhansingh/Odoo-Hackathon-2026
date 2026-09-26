package com.stocksense_backend.warehouse.service;

import com.stocksense_backend.warehouse.dto.WarehouseRequest;
import com.stocksense_backend.warehouse.entity.Warehouse;
import com.stocksense_backend.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional(readOnly = true)
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    @Transactional
    public Warehouse createWarehouse(WarehouseRequest request) {

        if (warehouseRepository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalArgumentException("Warehouse code already exists");
        }

        Warehouse warehouse = new Warehouse();

        warehouse.setName(request.getName());
        warehouse.setCode(request.getCode());
        warehouse.setAddress(request.getAddress());

        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public Warehouse updateWarehouse(
            UUID warehouseId,
            WarehouseRequest request) {

        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Warehouse not found"));

        warehouseRepository.findByCode(request.getCode())
                .filter(existing -> !existing.getId().equals(warehouseId))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "Warehouse code already exists");
                });

        warehouse.setName(request.getName());
        warehouse.setCode(request.getCode());
        warehouse.setAddress(request.getAddress());

        return warehouseRepository.save(warehouse);
    }
}