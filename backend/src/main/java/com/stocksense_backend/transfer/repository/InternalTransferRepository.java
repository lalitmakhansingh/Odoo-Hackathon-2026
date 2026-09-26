package com.stocksense_backend.transfer.repository;

import com.stocksense_backend.transfer.entity.InternalTransfer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InternalTransferRepository extends JpaRepository<InternalTransfer, UUID> {
}