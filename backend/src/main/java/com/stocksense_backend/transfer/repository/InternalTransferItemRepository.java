package com.stocksense_backend.transfer.repository;

import com.stocksense_backend.transfer.entity.InternalTransferItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InternalTransferItemRepository extends JpaRepository<InternalTransferItem, UUID> {

    List<InternalTransferItem> findByTransferId(UUID transferId);
}