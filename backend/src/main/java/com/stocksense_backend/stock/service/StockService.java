package com.stocksense_backend.stock.service;

import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.stock.entity.Stock;
import com.stocksense_backend.stock.repository.StockRepository;
import com.stocksense_backend.warehouse.entity.Location;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Transactional(readOnly = true)
    public Stock getStock(UUID productId, UUID locationId) {
        return stockRepository.findByProductIdAndLocationId(productId, locationId)
                .orElse(null);
    }

    @Transactional
    public Stock increaseStock(
            Product product,
            Location location,
            BigDecimal quantity
    ) {
        Stock stock = stockRepository
                .findWithLockByProductIdAndLocationId(
                        product.getId(),
                        location.getId()
                )
                .orElseGet(() -> createStock(product, location));

        stock.setQuantity(stock.getQuantity().add(quantity));

        return stockRepository.save(stock);
    }

    @Transactional
    public Stock decreaseStock(
            Product product,
            Location location,
            BigDecimal quantity
    ) {
        Stock stock = stockRepository
                .findWithLockByProductIdAndLocationId(
                        product.getId(),
                        location.getId()
                )
                .orElseThrow(() ->
                        new IllegalStateException("Stock record not found")
                );

        if (stock.getQuantity().compareTo(quantity) < 0) {
            throw new IllegalStateException("Insufficient stock");
        }

        stock.setQuantity(stock.getQuantity().subtract(quantity));

        return stockRepository.save(stock);
    }

    private Stock createStock(
            Product product,
            Location location
    ) {
        Stock stock = new Stock();
        stock.setProduct(product);
        stock.setLocation(location);
        stock.setQuantity(BigDecimal.ZERO);

        return stockRepository.save(stock);
    }

    @Transactional(readOnly = true)
public java.util.List<Stock> getAllStock() {
    return stockRepository.findAll();
}

@Transactional(readOnly = true)
public java.util.List<Stock> getStockByProduct(UUID productId) {
    return stockRepository.findByProductId(productId);
}

@Transactional(readOnly = true)
public java.util.List<Stock> getStockByLocation(UUID locationId) {
    return stockRepository.findByLocationId(locationId);
}
}