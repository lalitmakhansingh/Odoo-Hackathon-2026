package com.stocksense_backend.stock.controller;

import com.stocksense_backend.stock.dto.StockResponse;
import com.stocksense_backend.stock.entity.Stock;
import com.stocksense_backend.stock.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<StockResponse> getAllStock() {
        return stockService.getAllStock()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/product/{id}")
    public List<StockResponse> getStockByProduct(
            @PathVariable UUID id
    ) {
        return stockService.getStockByProduct(id)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/location/{id}")
    public List<StockResponse> getStockByLocation(
            @PathVariable UUID id
    ) {
        return stockService.getStockByLocation(id)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private StockResponse toResponse(Stock stock) {
        return new StockResponse(
                stock.getId(),
                stock.getProduct().getId(),
                stock.getLocation().getId(),
                stock.getQuantity(),
                stock.getUpdatedAt()
        );
    }
}