package com.stocksense_backend.ledger.repository;

import com.stocksense_backend.ledger.entity.StockMove;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StockMoveRepository extends JpaRepository<StockMove, UUID> {
}