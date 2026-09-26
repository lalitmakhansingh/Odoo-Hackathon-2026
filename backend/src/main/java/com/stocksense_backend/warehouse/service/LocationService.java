package com.stocksense_backend.warehouse.service;

import com.stocksense_backend.warehouse.dto.LocationRequest;
import com.stocksense_backend.warehouse.entity.Location;
import com.stocksense_backend.warehouse.entity.Warehouse;
import com.stocksense_backend.warehouse.repository.LocationRepository;
import com.stocksense_backend.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final WarehouseRepository warehouseRepository;

    public LocationService(
            LocationRepository locationRepository,
            WarehouseRepository warehouseRepository) {

        this.locationRepository = locationRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional(readOnly = true)
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    @Transactional
    public Location createLocation(LocationRequest request) {

        Warehouse warehouse = warehouseRepository
                .findById(request.getWarehouseId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Warehouse not found"));

        if (locationRepository
                .findByWarehouseAndCode(warehouse, request.getCode())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Location code already exists in this warehouse");
        }

        Location location = new Location();

        location.setWarehouse(warehouse);
        location.setName(request.getName());
        location.setCode(request.getCode());

        return locationRepository.save(location);
    }

    @Transactional
    public Location updateLocation(
            UUID locationId,
            LocationRequest request) {

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Location not found"));

        Warehouse warehouse = warehouseRepository
                .findById(request.getWarehouseId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Warehouse not found"));

        locationRepository
                .findByWarehouseAndCode(warehouse, request.getCode())
                .filter(existing -> !existing.getId().equals(locationId))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "Location code already exists in this warehouse");
                });

        location.setWarehouse(warehouse);
        location.setName(request.getName());
        location.setCode(request.getCode());

        return locationRepository.save(location);
    }
}