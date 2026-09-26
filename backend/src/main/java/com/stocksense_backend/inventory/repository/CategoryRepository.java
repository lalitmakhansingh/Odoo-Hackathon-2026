package com.stocksense_backend.inventory.repository;

import com.stocksense_backend.inventory.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}