package com.stocksense_backend.transfer.entity;

import com.stocksense_backend.inventory.entity.Product;
import com.stocksense_backend.warehouse.entity.Location;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
    name = "internal_transfer_items",
    indexes = {
        @Index(name = "idx_internal_transfer_items_transfer_id", columnList = "transfer_id"),
        @Index(name = "idx_internal_transfer_items_product_id", columnList = "product_id"),
        @Index(name = "idx_internal_transfer_items_source_location_id", columnList = "source_location_id"),
        @Index(name = "idx_internal_transfer_items_destination_location_id", columnList = "destination_location_id")
    }
)
public class InternalTransferItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transfer_id", nullable = false)
    private InternalTransfer transfer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_location_id", nullable = false)
    private Location sourceLocation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destination_location_id", nullable = false)
    private Location destinationLocation;

    @Column(nullable = false, precision = 19, scale = 3)
    private BigDecimal quantity;

    public UUID getId() {
        return id;
    }

    public InternalTransfer getTransfer() {
        return transfer;
    }

    public void setTransfer(InternalTransfer transfer) {
        this.transfer = transfer;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Location getSourceLocation() {
        return sourceLocation;
    }

    public void setSourceLocation(Location sourceLocation) {
        this.sourceLocation = sourceLocation;
    }

    public Location getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(Location destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }
}