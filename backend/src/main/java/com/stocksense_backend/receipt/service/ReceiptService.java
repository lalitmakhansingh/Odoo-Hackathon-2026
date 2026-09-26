package com.stocksense_backend.receipt.service;

import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.inventory.repository.ProductRepository;
import com.stocksense_backend.ledger.service.LedgerService;
import com.stocksense_backend.receipt.dto.CreateReceiptItemRequest;
import com.stocksense_backend.receipt.dto.CreateReceiptRequest;
import com.stocksense_backend.receipt.entity.Receipt;
import com.stocksense_backend.receipt.entity.ReceiptItem;
import com.stocksense_backend.receipt.repository.ReceiptItemRepository;
import com.stocksense_backend.receipt.repository.ReceiptRepository;
import com.stocksense_backend.stock.entity.Stock;
import com.stocksense_backend.stock.service.StockService;
import com.stocksense_backend.warehouse.entity.Location;
import com.stocksense_backend.warehouse.repository.LocationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptItemRepository receiptItemRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final StockService stockService;
    private final LedgerService ledgerService;

    public ReceiptService(
            ReceiptRepository receiptRepository,
            ReceiptItemRepository receiptItemRepository,
            ProductRepository productRepository,
            LocationRepository locationRepository,
            StockService stockService,
            LedgerService ledgerService
    ) {
        this.receiptRepository = receiptRepository;
        this.receiptItemRepository = receiptItemRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.stockService = stockService;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public Receipt createReceipt(CreateReceiptRequest request) {

        if (receiptRepository.findByReceiptNumber(request.getReceiptNumber()).isPresent()) {
            throw new IllegalArgumentException("Receipt number already exists");
        }

        Receipt receipt = new Receipt();
        receipt.setReceiptNumber(request.getReceiptNumber());
        receipt.setCreatedBy(request.getCreatedBy());
        receipt.setStatus("DRAFT");

        receipt = receiptRepository.save(receipt);

        List<ReceiptItem> items = new ArrayList<>();

        for (CreateReceiptItemRequest itemRequest : request.getItems()) {

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Product not found"));

            Location location = locationRepository.findById(itemRequest.getLocationId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Location not found"));

            ReceiptItem item = new ReceiptItem();
            item.setReceipt(receipt);
            item.setProduct(product);
            item.setLocation(location);
            item.setQuantity(itemRequest.getQuantity());

            items.add(item);
        }

        receiptItemRepository.saveAll(items);

        return receipt;
    }

    @Transactional
    public Receipt validateReceipt(UUID receiptId) {

        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Receipt not found"));

        if (!"DRAFT".equals(receipt.getStatus())
                && !"READY".equals(receipt.getStatus())) {
            throw new IllegalStateException(
                    "Receipt cannot be validated in current status"
            );
        }

        List<ReceiptItem> items =
                receiptItemRepository.findByReceiptId(receiptId);

        if (items.isEmpty()) {
            throw new IllegalStateException(
                    "Receipt must contain at least one item"
            );
        }

        for (ReceiptItem item : items) {

            Stock stock = stockService.getStock(
                    item.getProduct().getId(),
                    item.getLocation().getId()
            );

            java.math.BigDecimal quantityBefore =
                    stock == null
                            ? java.math.BigDecimal.ZERO
                            : stock.getQuantity();

            Stock updatedStock = stockService.increaseStock(
                    item.getProduct(),
                    item.getLocation(),
                    item.getQuantity()
            );

            ledgerService.recordMove(
                    item.getProduct(),
                    item.getLocation(),
                    item.getQuantity(),
                    quantityBefore,
                    updatedStock.getQuantity(),
                    "RECEIPT",
                    "RECEIPT",
                    receipt.getId(),
                    receipt.getCreatedBy()
            );
        }

        receipt.setStatus("DONE");
        receipt.setValidatedAt(LocalDateTime.now());

        return receiptRepository.save(receipt);
    }
}