# StockSense --- Inventory Management System

> A modular, real-time Inventory Management System built during the Odoo
> Hackathon 2026.

StockSense digitizes and streamlines stock-related operations by
replacing manual registers, spreadsheets, and scattered inventory
tracking with a centralized system for products, warehouses, locations,
receipts, deliveries, internal transfers, adjustments, and stock
movement history.

## 🚀 Project Overview

StockSense is designed for:

-   **Inventory Managers** --- manage incoming/outgoing stock and
    monitor inventory.
-   **Warehouse Staff** --- perform transfers, picking, shelving,
    counting, and stock adjustments.

The system provides a centralized view of inventory and maintains an
auditable stock ledger so that every stock-changing operation can be
traced.

## 🎯 Core Objectives

-   Centralize inventory data in a relational PostgreSQL database.
-   Provide real-time stock visibility by product and location.
-   Digitize incoming and outgoing stock workflows.
-   Support multi-warehouse and multi-location inventory.
-   Maintain a complete stock movement history.
-   Prevent invalid inventory operations through backend validation.
-   Provide a clean, responsive, and intuitive user interface.
-   Follow modular architecture, clean coding practices, and proper Git
    workflows.

## 🛠️ Technology Stack

### Frontend

-   React.js
-   React Router
-   JavaScript
-   HTML5 / CSS3
-   REST API integration

### Backend

-   Java
-   Spring Boot
-   Spring Web
-   Spring Data JPA / Hibernate
-   Spring Security
-   Bean Validation
-   RESTful APIs

### Database

-   PostgreSQL
-   Relational database design
-   Foreign keys and constraints
-   Transactions
-   Indexing

### Development & Collaboration

-   Git
-   GitHub
-   Postman / API testing tools
-   Maven
-   Environment-based configuration

### Optional / Supporting Technologies

-   JWT authentication
-   OTP/email service for password reset
-   Docker / deployment tooling where applicable

## 🏗️ System Architecture

``` text
                    ┌───────────────────────┐
                    │      React Client     │
                    │                       │
                    │ Dashboard             │
                    │ Products              │
                    │ Receipts              │
                    │ Deliveries            │
                    │ Transfers              │
                    │ Adjustments            │
                    │ Move History           │
                    └───────────┬───────────┘
                                │
                         HTTP / REST / JSON
                                │
                                ▼
                    ┌───────────────────────┐
                    │    Spring Boot API    │
                    │                       │
                    │ Controllers            │
                    │ Services               │
                    │ Repositories           │
                    │ Validation             │
                    │ Security               │
                    └───────────┬───────────┘
                                │
                         JPA / Hibernate
                                │
                                ▼
                    ┌───────────────────────┐
                    │      PostgreSQL       │
                    │                       │
                    │ Products              │
                    │ Warehouses             │
                    │ Locations              │
                    │ Stock                  │
                    │ Receipts               │
                    │ Deliveries             │
                    │ Transfers              │
                    │ Adjustments            │
                    │ Stock Moves            │
                    └───────────────────────┘
```

## 📦 Main Modules

### 1. Authentication & User Management

-   User registration
-   Login
-   JWT-based authentication
-   Role-based access control
-   OTP-based password reset
-   User profile management
-   Logout

### 2. Dashboard

The dashboard provides a real-time snapshot of inventory operations.

Key KPIs:

-   Total products in stock
-   Low-stock items
-   Out-of-stock items
-   Pending receipts
-   Pending deliveries
-   Scheduled internal transfers

Dynamic filters can be applied by:

-   Document type
-   Status
-   Warehouse
-   Location
-   Product category

### 3. Product Management

Products can be created and maintained with:

-   Product name
-   SKU / product code
-   Category
-   Unit of Measure
-   Initial stock
-   Reordering rules

The system also provides stock availability by location.

### 4. Warehouse & Location Management

Supports multiple warehouses and storage locations such as:

``` text
Main Warehouse
├── Rack A
├── Rack B
└── Production Area
```

Stock is tracked at the location level rather than only at the product
level.

### 5. Receipts --- Incoming Stock

Receipts are used when goods arrive from suppliers.

Workflow:

``` text
Create Receipt
      ↓
Select Supplier
      ↓
Add Products
      ↓
Enter Quantity
      ↓
Validate
      ↓
Stock Increases
      ↓
Stock Ledger Entry
```

Example:

``` text
Receive 100 Steel Rods
        ↓
Stock +100
```

### 6. Delivery Orders --- Outgoing Stock

Used when goods leave the warehouse.

Workflow:

``` text
Create Delivery
      ↓
Select Product
      ↓
Pick / Pack
      ↓
Validate Stock Availability
      ↓
Validate Delivery
      ↓
Stock Decreases
      ↓
Stock Ledger Entry
```

The backend prevents delivery quantities from exceeding available stock.

### 7. Internal Transfers

Internal transfers move stock between locations without changing the
company's total stock.

Example:

``` text
Main Warehouse
      │
      │ 30 units
      ▼
Production Rack
```

Result:

``` text
Source Location  → -30
Destination      → +30
Total Stock      → unchanged
```

Every transfer is recorded in the stock ledger.

### 8. Inventory Adjustments

Used when physical stock differs from recorded stock.

Example:

``` text
Recorded Stock: 100
Physical Count: 97

Adjustment: -3
Final Stock: 97
```

The adjustment is also logged for auditability.

### 9. Stock Ledger / Move History

Every stock-changing operation creates a movement record.

Movement types include:

-   Receipt
-   Delivery
-   Internal Transfer
-   Inventory Adjustment

Example:

``` text
Date        Product      Type              Qty
------------------------------------------------
26-Sep      Steel Rod    RECEIPT           +100
26-Sep      Steel Rod    TRANSFER           30
26-Sep      Steel Rod    DELIVERY           -20
26-Sep      Steel Rod    ADJUSTMENT          -3
```

This provides traceability for inventory changes.

## 🗄️ Database Design

The project uses PostgreSQL because the system requires strong
relational modelling, referential integrity, transactions, and reliable
inventory relationships.

Core entities include:

``` text
users
roles
categories
products
units_of_measure
reorder_rules

warehouses
locations
stock

receipts
receipt_items

deliveries
delivery_items

internal_transfers
internal_transfer_items

inventory_adjustments
inventory_adjustment_items

stock_moves
```

### Important Relationship Example

``` text
Warehouse
    │
    └── Locations
           │
           └── Stock
                  │
                  └── Product
```

A product can therefore have different quantities at different
locations.

## 🔄 Inventory Transaction Model

Stock is not directly modified from the frontend.

For example, validating a receipt follows:

``` text
React
  ↓
POST /api/receipts/{id}/validate
  ↓
Spring Boot Controller
  ↓
Inventory Service
  ↓
Database Transaction
  ├── Update stock
  ├── Create stock movement
  └── Update receipt status
  ↓
COMMIT
```

Spring transactions are used for critical stock operations so that
related database updates succeed or fail together.

## 🔐 Security & Validation

The application is designed with security and validation in mind.

-   JWT-based authentication
-   Password hashing
-   Role-based authorization
-   Backend request validation
-   Database constraints
-   Parameterized/JPA database access
-   Global exception handling
-   CORS configuration
-   Environment variables for secrets
-   Protection against invalid stock operations

Frontend validation improves user experience, while backend validation
remains the authoritative validation layer.

## 📁 Project Structure

``` text
StockSense/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── ER-Diagram.png
│   ├── API-Contract.md
│   └── Architecture.png
│
├── .gitignore
└── README.md
```

## 🔌 API Structure

The backend exposes RESTful APIs grouped by module.

### Authentication

``` text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/reset-password
GET  /api/users/me
PUT  /api/users/me
```

### Products

``` text
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Warehouses & Locations

``` text
GET  /api/warehouses
POST /api/warehouses
PUT  /api/warehouses/{id}

GET  /api/locations
POST /api/locations
PUT  /api/locations/{id}
```

### Inventory

``` text
GET /api/stock
GET /api/stock/product/{productId}
GET /api/stock/location/{locationId}
```

### Receipts

``` text
GET  /api/receipts
GET  /api/receipts/{id}
POST /api/receipts
PUT  /api/receipts/{id}
POST /api/receipts/{id}/validate
POST /api/receipts/{id}/cancel
```

### Deliveries

``` text
GET  /api/deliveries
GET  /api/deliveries/{id}
POST /api/deliveries
PUT  /api/deliveries/{id}
POST /api/deliveries/{id}/validate
POST /api/deliveries/{id}/cancel
```

### Transfers

``` text
GET  /api/transfers
GET  /api/transfers/{id}
POST /api/transfers
PUT  /api/transfers/{id}
POST /api/transfers/{id}/validate
POST /api/transfers/{id}/cancel
```

### Adjustments

``` text
GET  /api/adjustments
GET  /api/adjustments/{id}
POST /api/adjustments
PUT  /api/adjustments/{id}
POST /api/adjustments/{id}/validate
```

### Dashboard & Ledger

``` text
GET /api/dashboard/summary
GET /api/dashboard/low-stock
GET /api/dashboard/pending-receipts
GET /api/dashboard/pending-deliveries
GET /api/dashboard/transfers

GET /api/move-history
GET /api/move-history/product/{productId}
GET /api/move-history/location/{locationId}
```

## 🌱 Git & Team Workflow

The project follows a feature-branch workflow.

``` text
main
  │
  └── develop
       │
       ├── feature/backend-auth-products
       ├── feature/backend-inventory
       ├── feature/frontend-dashboard
       └── feature/frontend-operations
```

### Development workflow

``` bash
git checkout develop
git pull origin develop

git checkout -b feature/your-feature

# make changes

git add .
git commit -m "feat: describe the change"
git push -u origin feature/your-feature
```

Create a Pull Request into `develop` after completing the feature.

`main` is reserved for stable, tested versions.

## 👥 Team Responsibilities

### Backend Developer 1

-   Spring Boot architecture
-   Authentication & security
-   JWT
-   User management
-   Product and category APIs
-   Reordering rules

### Backend Developer 2

-   PostgreSQL database
-   ER design
-   Warehouse and locations
-   Stock management
-   Receipts
-   Deliveries
-   Internal transfers
-   Adjustments
-   Stock ledger
-   Inventory transactions

### Frontend Developer 1

-   React architecture
-   Routing
-   Dashboard
-   Authentication UI
-   Profile
-   Shared components
-   UI consistency

### Frontend Developer 2

-   Product UI
-   Receipts
-   Deliveries
-   Internal transfers
-   Adjustments
-   Move history
-   Inventory workflow UI

## 🧪 Testing Strategy

Important business scenarios include:

### Receipt

``` text
Initial Stock = 100
Receipt = 50
Expected Stock = 150
```

### Delivery

``` text
Stock = 100
Delivery = 20
Expected Stock = 80
```

### Invalid Delivery

``` text
Stock = 10
Delivery = 20
Expected = Operation rejected
Stock remains = 10
```

### Internal Transfer

``` text
Location A = 100
Location B = 50

Transfer = 20

Location A = 80
Location B = 70
Total = 150
```

### Adjustment

``` text
Recorded = 100
Physical = 97
Adjustment = -3
Final Stock = 97
```

## 📈 Design Principles

StockSense follows:

-   Separation of concerns
-   Modular architecture
-   RESTful API design
-   Relational database modelling
-   Service-layer business logic
-   Transactional inventory operations
-   Reusable frontend components
-   Backend validation
-   Centralized exception handling
-   Clean Git workflow
-   Scalable and maintainable code structure

## 🚧 Future Enhancements

Potential future improvements include:

-   Advanced inventory forecasting
-   Supplier management
-   Purchase orders
-   Barcode/QR scanning
-   Advanced analytics
-   Automated reorder suggestions
-   Email/notification alerts
-   Audit reports
-   Role-specific dashboards
-   Offline/local-first capabilities

## 🏆 Hackathon

**StockSense** was developed as part of the **Odoo Hackathon 2026**.

The project focuses on the hackathon's key engineering expectations:

-   Strong relational database design
-   Clean and modular architecture
-   Backend API design
-   Dynamic data
-   Robust input validation
-   Proper Git collaboration
-   Responsive and intuitive UI
-   Security
-   Scalability
-   Real-world business logic

## 📄 License

This project was developed for the Odoo Hackathon 2026.
