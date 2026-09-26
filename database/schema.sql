-- ============================================================
-- StockSense Inventory Management System
-- PostgreSQL Database Schema
-- ============================================================

-- ============================================================
-- 1. ROLES
-- ============================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_users_role_id
    ON users(role_id);


-- ============================================================
-- 3. CATEGORIES
-- ============================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. UNITS OF MEASURE
-- ============================================================

CREATE TABLE units_of_measure (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE
);


-- ============================================================
-- 5. PRODUCTS
-- ============================================================

CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    category_id UUID NOT NULL,
    unit_of_measure_id UUID NOT NULL,
    description VARCHAR(1000),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_products_unit
        FOREIGN KEY (unit_of_measure_id)
        REFERENCES units_of_measure(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_products_category_id
    ON products(category_id);


-- ============================================================
-- 6. WAREHOUSES
-- ============================================================

CREATE TABLE warehouses (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 7. LOCATIONS
-- ============================================================

CREATE TABLE locations (
    id UUID PRIMARY KEY,
    warehouse_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_locations_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_location_code_per_warehouse
        UNIQUE (warehouse_id, code)
);

CREATE INDEX idx_locations_warehouse_id
    ON locations(warehouse_id);


-- ============================================================
-- 8. REORDER RULES
-- ============================================================

CREATE TABLE reorder_rules (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    location_id UUID NOT NULL,

    min_quantity NUMERIC(19,3) NOT NULL,
    reorder_quantity NUMERIC(19,3) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reorder_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_reorder_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_reorder_product_location
        UNIQUE (product_id, location_id),

    CONSTRAINT chk_reorder_min_quantity
        CHECK (min_quantity >= 0),

    CONSTRAINT chk_reorder_quantity
        CHECK (reorder_quantity > 0)
);

CREATE INDEX idx_reorder_product_id
    ON reorder_rules(product_id);

CREATE INDEX idx_reorder_location_id
    ON reorder_rules(location_id);


-- ============================================================
-- 9. STOCK
-- ============================================================

CREATE TABLE stock (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    location_id UUID NOT NULL,

    quantity NUMERIC(19,3) NOT NULL DEFAULT 0,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_stock_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_stock_product_location
        UNIQUE (product_id, location_id),

    CONSTRAINT chk_stock_quantity
        CHECK (quantity >= 0)
);

CREATE INDEX idx_stock_product_id
    ON stock(product_id);

CREATE INDEX idx_stock_location_id
    ON stock(location_id);


-- ============================================================
-- 10. RECEIPTS
-- ============================================================

CREATE TABLE receipts (
    id UUID PRIMARY KEY,
    receipt_number VARCHAR(50) NOT NULL UNIQUE,

    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

    created_by UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP,

    CONSTRAINT fk_receipts_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_receipt_status
        CHECK (status IN (
            'DRAFT',
            'WAITING',
            'READY',
            'DONE',
            'CANCELED'
        ))
);

CREATE INDEX idx_receipts_status
    ON receipts(status);

CREATE INDEX idx_receipts_created_at
    ON receipts(created_at);


-- ============================================================
-- 11. RECEIPT ITEMS
-- ============================================================

CREATE TABLE receipt_items (
    id UUID PRIMARY KEY,
    receipt_id UUID NOT NULL,
    product_id UUID NOT NULL,
    location_id UUID NOT NULL,

    quantity NUMERIC(19,3) NOT NULL,

    CONSTRAINT fk_receipt_items_receipt
        FOREIGN KEY (receipt_id)
        REFERENCES receipts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_receipt_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_receipt_items_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_receipt_item_quantity
        CHECK (quantity > 0)
);

CREATE INDEX idx_receipt_items_receipt_id
    ON receipt_items(receipt_id);

CREATE INDEX idx_receipt_items_product_id
    ON receipt_items(product_id);

CREATE INDEX idx_receipt_items_location_id
    ON receipt_items(location_id);


-- ============================================================
-- 12. DELIVERIES
-- ============================================================

CREATE TABLE deliveries (
    id UUID PRIMARY KEY,
    delivery_number VARCHAR(50) NOT NULL UNIQUE,

    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

    created_by UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP,

    CONSTRAINT fk_deliveries_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_delivery_status
        CHECK (status IN (
            'DRAFT',
            'WAITING',
            'READY',
            'DONE',
            'CANCELED'
        ))
);

CREATE INDEX idx_deliveries_status
    ON deliveries(status);

CREATE INDEX idx_deliveries_created_at
    ON deliveries(created_at);


-- ============================================================
-- 13. DELIVERY ITEMS
-- ============================================================

CREATE TABLE delivery_items (
    id UUID PRIMARY KEY,
    delivery_id UUID NOT NULL,
    product_id UUID NOT NULL,
    location_id UUID NOT NULL,

    quantity NUMERIC(19,3) NOT NULL,

    CONSTRAINT fk_delivery_items_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES deliveries(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_delivery_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_delivery_items_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_delivery_item_quantity
        CHECK (quantity > 0)
);

CREATE INDEX idx_delivery_items_delivery_id
    ON delivery_items(delivery_id);

CREATE INDEX idx_delivery_items_product_id
    ON delivery_items(product_id);

CREATE INDEX idx_delivery_items_location_id
    ON delivery_items(location_id);


-- ============================================================
-- 14. INTERNAL TRANSFERS
-- ============================================================

CREATE TABLE internal_transfers (
    id UUID PRIMARY KEY,
    transfer_number VARCHAR(50) NOT NULL UNIQUE,

    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

    created_by UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP,

    CONSTRAINT fk_transfers_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_transfer_status
        CHECK (status IN (
            'DRAFT',
            'WAITING',
            'READY',
            'DONE',
            'CANCELED'
        ))
);

CREATE INDEX idx_transfers_status
    ON internal_transfers(status);

CREATE INDEX idx_transfers_created_at
    ON internal_transfers(created_at);


-- ============================================================
-- 15. INTERNAL TRANSFER ITEMS
-- ============================================================

CREATE TABLE internal_transfer_items (
    id UUID PRIMARY KEY,
    transfer_id UUID NOT NULL,
    product_id UUID NOT NULL,

    source_location_id UUID NOT NULL,
    destination_location_id UUID NOT NULL,

    quantity NUMERIC(19,3) NOT NULL,

    CONSTRAINT fk_transfer_items_transfer
        FOREIGN KEY (transfer_id)
        REFERENCES internal_transfers(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transfer_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_transfer_items_source
        FOREIGN KEY (source_location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_transfer_items_destination
        FOREIGN KEY (destination_location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_transfer_item_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_transfer_different_locations
        CHECK (source_location_id <> destination_location_id)
);

CREATE INDEX idx_transfer_items_transfer_id
    ON internal_transfer_items(transfer_id);

CREATE INDEX idx_transfer_items_product_id
    ON internal_transfer_items(product_id);

CREATE INDEX idx_transfer_items_source_location
    ON internal_transfer_items(source_location_id);

CREATE INDEX idx_transfer_items_destination_location
    ON internal_transfer_items(destination_location_id);


-- ============================================================
-- 16. INVENTORY ADJUSTMENTS
-- ============================================================

CREATE TABLE inventory_adjustments (
    id UUID PRIMARY KEY,
    adjustment_number VARCHAR(50) NOT NULL UNIQUE,

    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

    created_by UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP,

    CONSTRAINT fk_adjustments_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_adjustment_status
        CHECK (status IN (
            'DRAFT',
            'WAITING',
            'READY',
            'DONE',
            'CANCELED'
        ))
);

CREATE INDEX idx_adjustments_status
    ON inventory_adjustments(status);

CREATE INDEX idx_adjustments_created_at
    ON inventory_adjustments(created_at);


-- ============================================================
-- 17. INVENTORY ADJUSTMENT ITEMS
-- ============================================================

CREATE TABLE inventory_adjustment_items (
    id UUID PRIMARY KEY,
    adjustment_id UUID NOT NULL,
    product_id UUID NOT NULL,
    location_id UUID NOT NULL,

    counted_quantity NUMERIC(19,3) NOT NULL,
    system_quantity NUMERIC(19,3) NOT NULL,
    difference NUMERIC(19,3) NOT NULL,

    CONSTRAINT fk_adjustment_items_adjustment
        FOREIGN KEY (adjustment_id)
        REFERENCES inventory_adjustments(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_adjustment_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_adjustment_items_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_adjustment_counted_quantity
        CHECK (counted_quantity >= 0)
);

CREATE INDEX idx_adjustment_items_adjustment_id
    ON inventory_adjustment_items(adjustment_id);

CREATE INDEX idx_adjustment_items_product_id
    ON inventory_adjustment_items(product_id);

CREATE INDEX idx_adjustment_items_location_id
    ON inventory_adjustment_items(location_id);


-- ============================================================
-- 18. STOCK MOVES
-- ============================================================

CREATE TABLE stock_moves (
    id UUID PRIMARY KEY,

    product_id UUID NOT NULL,
    location_id UUID NOT NULL,

    quantity NUMERIC(19,3) NOT NULL,
    quantity_before NUMERIC(19,3) NOT NULL,
    quantity_after NUMERIC(19,3) NOT NULL,

    movement_type VARCHAR(30) NOT NULL,

    reference_type VARCHAR(30) NOT NULL,
    reference_id UUID NOT NULL,

    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_moves_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_stock_moves_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_stock_moves_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_stock_move_type
        CHECK (movement_type IN (
            'RECEIPT',
            'DELIVERY',
            'TRANSFER_IN',
            'TRANSFER_OUT',
            'ADJUSTMENT'
        )),

    CONSTRAINT chk_stock_move_reference_type
        CHECK (reference_type IN (
            'RECEIPT',
            'DELIVERY',
            'TRANSFER',
            'ADJUSTMENT'
        )),

    CONSTRAINT chk_stock_move_quantity_before
        CHECK (quantity_before >= 0),

    CONSTRAINT chk_stock_move_quantity_after
        CHECK (quantity_after >= 0),

    CONSTRAINT chk_stock_move_quantity
        CHECK (quantity <> 0)
);

CREATE INDEX idx_stock_moves_product_id
    ON stock_moves(product_id);

CREATE INDEX idx_stock_moves_location_id
    ON stock_moves(location_id);

CREATE INDEX idx_stock_moves_created_at
    ON stock_moves(created_at);

CREATE INDEX idx_stock_moves_reference
    ON stock_moves(reference_type, reference_id);
CREATE TABLE otp_tokens (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email VARCHAR(255),
    otp VARCHAR(255),
    expires_at TIMESTAMP
);
