package com.stocksense_backend.warehouse.controller;

import com.stocksense_backend.warehouse.dto.LocationRequest;
import com.stocksense_backend.warehouse.dto.LocationResponse;
import com.stocksense_backend.warehouse.entity.Location;
import com.stocksense_backend.warehouse.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public List<LocationResponse> getAllLocations() {

        return locationService.getAllLocations()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LocationResponse createLocation(
            @Valid @RequestBody LocationRequest request) {

        return toResponse(locationService.createLocation(request));
    }

    @PutMapping("/{id}")
    public LocationResponse updateLocation(
            @PathVariable UUID id,
            @Valid @RequestBody LocationRequest request) {

        return toResponse(
                locationService.updateLocation(id, request)
        );
    }

    private LocationResponse toResponse(Location location) {

        return new LocationResponse(
                location.getId(),
                location.getWarehouse().getId(),
                location.getName(),
                location.getCode(),
                location.getCreatedAt(),
                location.getUpdatedAt()
        );
    }
}