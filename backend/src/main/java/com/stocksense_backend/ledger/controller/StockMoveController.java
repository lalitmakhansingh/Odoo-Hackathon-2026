package com.stocksense_backend.ledger.controller;

import com.stocksense.common.ApiResponse;
import com.stocksense_backend.ledger.dto.StockMoveResponse;
import com.stocksense_backend.ledger.service.LedgerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stock-moves")
public class StockMoveController {

    private final LedgerService ledgerService;

    public StockMoveController(LedgerService ledgerService) {
        this.ledgerService = ledgerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StockMoveResponse>>> getAllStockMoves() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        ledgerService.getAllStockMoves(),
                        "Stock moves retrieved successfully"
                )
        );
    }
}
