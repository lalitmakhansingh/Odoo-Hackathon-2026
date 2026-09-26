package com.stocksense_backend.transfer.controller;

import com.stocksense_backend.transfer.dto.CreateTransferRequest;
import com.stocksense_backend.transfer.entity.InternalTransfer;
import com.stocksense_backend.transfer.repository.InternalTransferRepository;
import com.stocksense_backend.transfer.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;
    private final InternalTransferRepository transferRepository;

    public TransferController(
            TransferService transferService,
            InternalTransferRepository transferRepository) {
        this.transferService = transferService;
        this.transferRepository = transferRepository;
    }

    @PostMapping
    public ResponseEntity<InternalTransfer> createTransfer(
            @Valid @RequestBody CreateTransferRequest request) {

        return ResponseEntity.ok(
                transferService.createTransfer(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<InternalTransfer>> getTransfers() {

        return ResponseEntity.ok(
                transferRepository.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternalTransfer> getTransfer(
            @PathVariable UUID id) {

        return transferRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<InternalTransfer> validateTransfer(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                transferService.validateTransfer(id)
        );
    }
}