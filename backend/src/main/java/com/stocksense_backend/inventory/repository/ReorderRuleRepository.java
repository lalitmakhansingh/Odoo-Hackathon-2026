package com.stocksense_backend.inventory.repository;

import com.stocksense_backend.inventory.entity.ReorderRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReorderRuleRepository extends JpaRepository<ReorderRule, UUID> {
}