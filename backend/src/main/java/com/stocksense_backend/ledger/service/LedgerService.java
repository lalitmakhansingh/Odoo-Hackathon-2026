package com.stocksense_backend.ledger.service;

import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.ledger.entity.StockMove;
import com.stocksense_backend.ledger.repository.StockMoveRepository;
import com.stocksense_backend.warehouse.entity.Location;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class LedgerService {

    private final StockMoveRepository stockMoveRepository;

    public LedgerService(StockMoveRepository stockMoveRepository) {
        this.stockMoveRepository = stockMoveRepository;
    }

    public StockMove recordMove(
            Product product,
            Location location,
            BigDecimal quantity,
            BigDecimal quantityBefore,
            BigDecimal quantityAfter,
            String movementType,
            String referenceType,
            UUID referenceId,
            UUID createdBy
    ) {
        StockMove move = new StockMove();

        move.setProduct(product);
        move.setLocation(location);
        move.setQuantity(quantity);
        move.setQuantityBefore(quantityBefore);
        move.setQuantityAfter(quantityAfter);
        move.setMovementType(movementType);
        move.setReferenceType(referenceType);
        move.setReferenceId(referenceId);
        move.setCreatedBy(createdBy);

        return stockMoveRepository.save(move);
    }
}