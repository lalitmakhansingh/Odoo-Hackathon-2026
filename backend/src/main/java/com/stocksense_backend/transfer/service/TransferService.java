package com.stocksense_backend.transfer.service;

import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.inventory.repository.ProductRepository;
import com.stocksense_backend.ledger.service.LedgerService;
import com.stocksense_backend.stock.entity.Stock;
import com.stocksense_backend.stock.service.StockService;
import com.stocksense_backend.transfer.dto.CreateTransferItemRequest;
import com.stocksense_backend.transfer.dto.CreateTransferRequest;
import com.stocksense_backend.transfer.entity.InternalTransfer;
import com.stocksense_backend.transfer.entity.InternalTransferItem;
import com.stocksense_backend.transfer.repository.InternalTransferItemRepository;
import com.stocksense_backend.transfer.repository.InternalTransferRepository;
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
public class TransferService {

    private final InternalTransferRepository transferRepository;
    private final InternalTransferItemRepository transferItemRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final StockService stockService;
    private final LedgerService ledgerService;

    public TransferService(
            InternalTransferRepository transferRepository,
            InternalTransferItemRepository transferItemRepository,
            ProductRepository productRepository,
            LocationRepository locationRepository,
            StockService stockService,
            LedgerService ledgerService) {

        this.transferRepository = transferRepository;
        this.transferItemRepository = transferItemRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.stockService = stockService;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public InternalTransfer createTransfer(CreateTransferRequest request) {

        if (transferRepository.findByTransferNumber(request.getTransferNumber()).isPresent()) {
            throw new IllegalArgumentException("Transfer number already exists");
        }

        InternalTransfer transfer = new InternalTransfer();
        transfer.setTransferNumber(request.getTransferNumber());
        transfer.setCreatedBy(request.getCreatedBy());
        transfer.setStatus("DRAFT");

        transfer = transferRepository.save(transfer);

        List<InternalTransferItem> items = new ArrayList<>();

        for (CreateTransferItemRequest itemRequest : request.getItems()) {

            if (itemRequest.getSourceLocationId()
                    .equals(itemRequest.getDestinationLocationId())) {
                throw new IllegalArgumentException(
                        "Source and destination locations must be different");
            }

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Product not found"));

            Location sourceLocation = locationRepository
                    .findById(itemRequest.getSourceLocationId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Source location not found"));

            Location destinationLocation = locationRepository
                    .findById(itemRequest.getDestinationLocationId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Destination location not found"));

            InternalTransferItem item = new InternalTransferItem();
            item.setTransfer(transfer);
            item.setProduct(product);
            item.setSourceLocation(sourceLocation);
            item.setDestinationLocation(destinationLocation);
            item.setQuantity(itemRequest.getQuantity());

            items.add(item);
        }

        transferItemRepository.saveAll(items);

        return transfer;
    }

    @Transactional
    public InternalTransfer validateTransfer(UUID transferId) {

        InternalTransfer transfer = transferRepository.findById(transferId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Transfer not found"));

        if (!"DRAFT".equals(transfer.getStatus()) &&
                !"READY".equals(transfer.getStatus())) {
            throw new IllegalStateException(
                    "Transfer cannot be validated in current status");
        }

        List<InternalTransferItem> items =
                transferItemRepository.findByTransferId(transferId);

        if (items.isEmpty()) {
            throw new IllegalStateException(
                    "Transfer must contain at least one item");
        }

        for (InternalTransferItem item : items) {

            Stock sourceStock = stockService.getStock(
                    item.getProduct().getId(),
                    item.getSourceLocation().getId());

            if (sourceStock == null) {
                throw new IllegalStateException(
                        "No stock available at source location");
            }

            BigDecimal quantityBeforeSource =
                    sourceStock.getQuantity();

            if (quantityBeforeSource.compareTo(item.getQuantity()) < 0) {
                throw new IllegalStateException(
                        "Insufficient stock for product "
                                + item.getProduct().getSku());
            }

            Stock updatedSourceStock = stockService.decreaseStock(
                    item.getProduct(),
                    item.getSourceLocation(),
                    item.getQuantity());

            ledgerService.recordMove(
                    item.getProduct(),
                    item.getSourceLocation(),
                    item.getQuantity().negate(),
                    quantityBeforeSource,
                    updatedSourceStock.getQuantity(),
                    "TRANSFER_OUT",
                    "TRANSFER",
                    transfer.getId(),
                    transfer.getCreatedBy());

            Stock destinationStock = stockService.getStock(
                    item.getProduct().getId(),
                    item.getDestinationLocation().getId());

            BigDecimal quantityBeforeDestination =
                    destinationStock == null
                            ? BigDecimal.ZERO
                            : destinationStock.getQuantity();

            Stock updatedDestinationStock = stockService.increaseStock(
                    item.getProduct(),
                    item.getDestinationLocation(),
                    item.getQuantity());

            ledgerService.recordMove(
                    item.getProduct(),
                    item.getDestinationLocation(),
                    item.getQuantity(),
                    quantityBeforeDestination,
                    updatedDestinationStock.getQuantity(),
                    "TRANSFER_IN",
                    "TRANSFER",
                    transfer.getId(),
                    transfer.getCreatedBy());
        }

        transfer.setStatus("DONE");
        transfer.setValidatedAt(LocalDateTime.now());

        return transferRepository.save(transfer);
    }
}