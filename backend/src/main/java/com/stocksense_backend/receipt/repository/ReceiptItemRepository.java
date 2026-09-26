package com.stocksense_backend.receipt.repository;

import com.stocksense_backend.receipt.entity.ReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReceiptItemRepository extends JpaRepository<ReceiptItem, UUID> {

    List<ReceiptItem> findByReceiptId(UUID receiptId);
}