package com.stocksense_backend.receipt.controller;

import com.stocksense_backend.receipt.dto.CreateReceiptRequest;
import com.stocksense_backend.receipt.entity.Receipt;
import com.stocksense_backend.receipt.repository.ReceiptRepository;
import com.stocksense_backend.receipt.service.ReceiptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;
    private final ReceiptRepository receiptRepository;

    public ReceiptController(
            ReceiptService receiptService,
            ReceiptRepository receiptRepository
    ) {
        this.receiptService = receiptService;
        this.receiptRepository = receiptRepository;
    }

    @PostMapping
    public ResponseEntity<Receipt> createReceipt(
            @Valid @RequestBody CreateReceiptRequest request
    ) {
        Receipt receipt = receiptService.createReceipt(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(receipt);
    }

    @GetMapping
    public ResponseEntity<List<Receipt>> getReceipts() {
        return ResponseEntity.ok(receiptRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceipt(
            @PathVariable UUID id
    ) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Receipt not found"));

        return ResponseEntity.ok(receipt);
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<Receipt> validateReceipt(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                receiptService.validateReceipt(id)
        );
    }
}