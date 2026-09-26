package com.stocksense_backend.delivery.controller;

import com.stocksense_backend.delivery.dto.CreateDeliveryRequest;
import com.stocksense_backend.delivery.entity.Delivery;
import com.stocksense_backend.delivery.repository.DeliveryRepository;
import com.stocksense_backend.delivery.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final DeliveryRepository deliveryRepository;

    public DeliveryController(
            DeliveryService deliveryService,
            DeliveryRepository deliveryRepository) {
        this.deliveryService = deliveryService;
        this.deliveryRepository = deliveryRepository;
    }

    @PostMapping
    public ResponseEntity<Delivery> createDelivery(
            @Valid @RequestBody CreateDeliveryRequest request) {

        return ResponseEntity.ok(
                deliveryService.createDelivery(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Delivery>> getDeliveries() {

        return ResponseEntity.ok(
                deliveryRepository.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDelivery(
            @PathVariable UUID id) {

        return deliveryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<Delivery> validateDelivery(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                deliveryService.validateDelivery(id)
        );
    }
}