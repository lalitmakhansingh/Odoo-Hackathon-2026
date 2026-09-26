package com.stocksense_backend.adjustment.service;

import com.stocksense_backend.adjustment.dto.CreateAdjustmentItemRequest;
import com.stocksense_backend.adjustment.dto.CreateAdjustmentRequest;
import com.stocksense_backend.adjustment.entity.InventoryAdjustment;
import com.stocksense_backend.adjustment.entity.InventoryAdjustmentItem;
import com.stocksense_backend.adjustment.repository.InventoryAdjustmentItemRepository;
import com.stocksense_backend.adjustment.repository.InventoryAdjustmentRepository;
import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.inventory.repository.ProductRepository;
import com.stocksense_backend.ledger.service.LedgerService;
import com.stocksense_backend.stock.entity.Stock;
import com.stocksense_backend.stock.service.StockService;
import com.stocksense_backend.warehouse.entity.Location;
import com.stocksense_backend.warehouse.repository.LocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class InventoryAdjustmentService {

    private final InventoryAdjustmentRepository adjustmentRepository;
    private final InventoryAdjustmentItemRepository adjustmentItemRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final StockService stockService;
    private final LedgerService ledgerService;

    public InventoryAdjustmentService(
            InventoryAdjustmentRepository adjustmentRepository,
            InventoryAdjustmentItemRepository adjustmentItemRepository,
            ProductRepository productRepository,
            LocationRepository locationRepository,
            StockService stockService,
            LedgerService ledgerService) {

        this.adjustmentRepository = adjustmentRepository;
        this.adjustmentItemRepository = adjustmentItemRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.stockService = stockService;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public InventoryAdjustment createAdjustment(CreateAdjustmentRequest request) {

        if (adjustmentRepository
                .findByAdjustmentNumber(request.getAdjustmentNumber())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Adjustment number already exists");
        }

        InventoryAdjustment adjustment = new InventoryAdjustment();

        adjustment.setAdjustmentNumber(request.getAdjustmentNumber());
        adjustment.setCreatedBy(request.getCreatedBy());
        adjustment.setStatus("DRAFT");

        adjustment = adjustmentRepository.save(adjustment);

        List<InventoryAdjustmentItem> items = new ArrayList<>();

        for (CreateAdjustmentItemRequest itemRequest : request.getItems()) {

            Product product = productRepository
                    .findById(itemRequest.getProductId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Product not found"));

            Location location = locationRepository
                    .findById(itemRequest.getLocationId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Location not found"));

            InventoryAdjustmentItem item =
                    new InventoryAdjustmentItem();

            item.setAdjustment(adjustment);
            item.setProduct(product);
            item.setLocation(location);
            item.setCountedQuantity(itemRequest.getCountedQuantity());

            // These values are calculated during validation.
            // Database columns are NOT NULL, so initialize them for DRAFT.
            item.setSystemQuantity(BigDecimal.ZERO);
            item.setDifference(BigDecimal.ZERO);

            items.add(item);
        }

        adjustmentItemRepository.saveAll(items);

        return adjustment;
    }

    @Transactional
    public InventoryAdjustment validateAdjustment(UUID adjustmentId) {

        InventoryAdjustment adjustment =
                adjustmentRepository.findById(adjustmentId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Adjustment not found"));

        if (!"DRAFT".equals(adjustment.getStatus())
                && !"READY".equals(adjustment.getStatus())) {

            throw new IllegalStateException(
                    "Adjustment cannot be validated in current status");
        }

        List<InventoryAdjustmentItem> items =
                adjustmentItemRepository
                        .findByAdjustmentId(adjustmentId);

        if (items.isEmpty()) {
            throw new IllegalStateException(
                    "Adjustment must contain at least one item");
        }

        for (InventoryAdjustmentItem item : items) {

            Stock stock = stockService.getStock(
                    item.getProduct().getId(),
                    item.getLocation().getId()
            );

            BigDecimal systemQuantity =
                    stock == null
                            ? BigDecimal.ZERO
                            : stock.getQuantity();

            BigDecimal countedQuantity =
                    item.getCountedQuantity();

            BigDecimal difference =
                    countedQuantity.subtract(systemQuantity);

            item.setSystemQuantity(systemQuantity);
            item.setDifference(difference);

            if (difference.compareTo(BigDecimal.ZERO) > 0) {

                Stock updatedStock =
                        stockService.increaseStock(
                                item.getProduct(),
                                item.getLocation(),
                                difference
                        );

                ledgerService.recordMove(
                        item.getProduct(),
                        item.getLocation(),
                        difference,
                        systemQuantity,
                        updatedStock.getQuantity(),
                        "ADJUSTMENT",
                        "ADJUSTMENT",
                        adjustment.getId(),
                        adjustment.getCreatedBy()
                );

            } else if (difference.compareTo(BigDecimal.ZERO) < 0) {

                BigDecimal decreaseQuantity =
                        difference.abs();

                Stock updatedStock =
                        stockService.decreaseStock(
                                item.getProduct(),
                                item.getLocation(),
                                decreaseQuantity
                        );

                ledgerService.recordMove(
                        item.getProduct(),
                        item.getLocation(),
                        difference,
                        systemQuantity,
                        updatedStock.getQuantity(),
                        "ADJUSTMENT",
                        "ADJUSTMENT",
                        adjustment.getId(),
                        adjustment.getCreatedBy()
                );
            }
        }

        adjustmentItemRepository.saveAll(items);

        adjustment.setStatus("DONE");
        adjustment.setValidatedAt(LocalDateTime.now());

        return adjustmentRepository.save(adjustment);
    }

    @Transactional(readOnly = true)
    public List<InventoryAdjustment> getAllAdjustments() {
        return adjustmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public InventoryAdjustment getAdjustment(UUID adjustmentId) {

        return adjustmentRepository.findById(adjustmentId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Adjustment not found"));
    }
}