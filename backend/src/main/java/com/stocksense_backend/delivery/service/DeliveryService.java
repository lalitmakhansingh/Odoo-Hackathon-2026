package com.stocksense_backend.delivery.service;

import com.stocksense_backend.delivery.dto.CreateDeliveryItemRequest;
import com.stocksense_backend.delivery.dto.CreateDeliveryRequest;
import com.stocksense_backend.delivery.entity.Delivery;
import com.stocksense_backend.delivery.entity.DeliveryItem;
import com.stocksense_backend.delivery.repository.DeliveryItemRepository;
import com.stocksense_backend.delivery.repository.DeliveryRepository;
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
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryItemRepository deliveryItemRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final StockService stockService;
    private final LedgerService ledgerService;

    public DeliveryService(
            DeliveryRepository deliveryRepository,
            DeliveryItemRepository deliveryItemRepository,
            ProductRepository productRepository,
            LocationRepository locationRepository,
            StockService stockService,
            LedgerService ledgerService) {

        this.deliveryRepository = deliveryRepository;
        this.deliveryItemRepository = deliveryItemRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.stockService = stockService;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public Delivery createDelivery(CreateDeliveryRequest request) {

        if (deliveryRepository.findByDeliveryNumber(request.getDeliveryNumber()).isPresent()) {
            throw new IllegalArgumentException("Delivery number already exists");
        }

        Delivery delivery = new Delivery();
        delivery.setDeliveryNumber(request.getDeliveryNumber());
        delivery.setCreatedBy(request.getCreatedBy());
        delivery.setStatus("DRAFT");

        delivery = deliveryRepository.save(delivery);

        List<DeliveryItem> items = new ArrayList<>();

        for (CreateDeliveryItemRequest itemRequest : request.getItems()) {

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            Location location = locationRepository.findById(itemRequest.getLocationId())
                    .orElseThrow(() -> new IllegalArgumentException("Location not found"));

            DeliveryItem item = new DeliveryItem();
            item.setDelivery(delivery);
            item.setProduct(product);
            item.setLocation(location);
            item.setQuantity(itemRequest.getQuantity());

            items.add(item);
        }

        deliveryItemRepository.saveAll(items);

        return delivery;
    }

    @Transactional
    public Delivery validateDelivery(UUID deliveryId) {

        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        if (!"DRAFT".equals(delivery.getStatus()) &&
                !"READY".equals(delivery.getStatus())) {
            throw new IllegalStateException(
                    "Delivery cannot be validated in current status");
        }

        List<DeliveryItem> items =
                deliveryItemRepository.findByDeliveryId(deliveryId);

        if (items.isEmpty()) {
            throw new IllegalStateException(
                    "Delivery must contain at least one item");
        }

        for (DeliveryItem item : items) {

            Stock stock = stockService.getStock(
                    item.getProduct().getId(),
                    item.getLocation().getId());

            if (stock == null) {
                throw new IllegalStateException(
                        "No stock available for product at location");
            }

            BigDecimal quantityBefore = stock.getQuantity();

            if (quantityBefore.compareTo(item.getQuantity()) < 0) {
                throw new IllegalStateException(
                        "Insufficient stock for product "
                                + item.getProduct().getSku());
            }

            Stock updatedStock = stockService.decreaseStock(
                    item.getProduct(),
                    item.getLocation(),
                    item.getQuantity());

            ledgerService.recordMove(
                    item.getProduct(),
                    item.getLocation(),
                    item.getQuantity().negate(),
                    quantityBefore,
                    updatedStock.getQuantity(),
                    "DELIVERY",
                    "DELIVERY",
                    delivery.getId(),
                    delivery.getCreatedBy());
        }

        delivery.setStatus("DONE");
        delivery.setValidatedAt(LocalDateTime.now());

        return deliveryRepository.save(delivery);
    }
}