package com.stocksense_backend.adjustment.entity;

import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.warehouse.entity.Location;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
    name = "inventory_adjustment_items",
    indexes = {
        @Index(name = "idx_inventory_adjustment_items_adjustment_id", columnList = "adjustment_id"),
        @Index(name = "idx_inventory_adjustment_items_product_id", columnList = "product_id"),
        @Index(name = "idx_inventory_adjustment_items_location_id", columnList = "location_id")
    }
)
public class InventoryAdjustmentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "adjustment_id", nullable = false)
    private InventoryAdjustment adjustment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "counted_quantity", nullable = false, precision = 19, scale = 3)
    private BigDecimal countedQuantity;

    @Column(name = "system_quantity", nullable = false, precision = 19, scale = 3)
    private BigDecimal systemQuantity;

    @Column(nullable = false, precision = 19, scale = 3)
    private BigDecimal difference;

    public UUID getId() {
        return id;
    }

    public InventoryAdjustment getAdjustment() {
        return adjustment;
    }

    public void setAdjustment(InventoryAdjustment adjustment) {
        this.adjustment = adjustment;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public BigDecimal getCountedQuantity() {
        return countedQuantity;
    }

    public void setCountedQuantity(BigDecimal countedQuantity) {
        this.countedQuantity = countedQuantity;
    }

    public BigDecimal getSystemQuantity() {
        return systemQuantity;
    }

    public void setSystemQuantity(BigDecimal systemQuantity) {
        this.systemQuantity = systemQuantity;
    }

    public BigDecimal getDifference() {
        return difference;
    }

    public void setDifference(BigDecimal difference) {
        this.difference = difference;
    }
}