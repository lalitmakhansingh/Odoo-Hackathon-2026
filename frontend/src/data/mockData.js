export const mockCategories = [
  {
    id: 1,
    name: "Raw Materials",
    description: "Base industrial items",
  },
  {
    id: 2,
    name: "Finished Goods",
    description: "Completed products",
  },
  {
    id: 3,
    name: "Components",
    description: "Manufacturing components",
  },
];

export const mockUoms = [
  {
    id: 1,
    name: "Kilogram",
    code: "KG",
  },
  {
    id: 2,
    name: "Piece",
    code: "PCS",
  },
  {
    id: 3,
    name: "Liter",
    code: "L",
  },
];

export const mockProducts = [
  {
    id: 1,
    name: "Steel Rods",
    sku: "STEEL-ROD-01",
    category: mockCategories[0],
    unitOfMeasure: mockUoms[0],
    description: "High grade steel rods",
  },
  {
    id: 2,
    name: "Chair Frame",
    sku: "CHAIR-FRAME-01",
    category: mockCategories[1],
    unitOfMeasure: mockUoms[1],
    description: "Metal chair frame",
  },
  {
    id: 3,
    name: "Steel Sheet",
    sku: "STEEL-SHEET-01",
    category: mockCategories[0],
    unitOfMeasure: mockUoms[1],
    description: "Industrial steel sheet",
  },
  {
    id: 4,
    name: "Machine Bolt",
    sku: "BOLT-001",
    category: mockCategories[2],
    unitOfMeasure: mockUoms[1],
    description: "Heavy duty machine bolt",
  },
];

export const mockStock = [
  {
    id: 1,
    productId: 1,
    warehouseId: 1,
    warehouseName: "Main Warehouse",
    locationId: 1,
    locationName: "Rack A",
    quantity: 150,
  },
  {
    id: 2,
    productId: 1,
    warehouseId: 1,
    warehouseName: "Main Warehouse",
    locationId: 2,
    locationName: "Production Rack",
    quantity: 30,
  },
  {
    id: 3,
    productId: 2,
    warehouseId: 1,
    warehouseName: "Main Warehouse",
    locationId: 1,
    locationName: "Rack A",
    quantity: 18,
  },
  {
    id: 4,
    productId: 3,
    warehouseId: 1,
    warehouseName: "Main Warehouse",
    locationId: 1,
    locationName: "Rack B",
    quantity: 75,
  },
  {
    id: 5,
    productId: 4,
    warehouseId: 1,
    warehouseName: "Main Warehouse",
    locationId: 1,
    locationName: "Rack C",
    quantity: 0,
  },
];

export const mockReorderRules = [
  {
    id: 1,
    product: {
      id: 1,
    },
    location: {
      id: 1,
    },
    minQuantity: 50,
    reorderQuantity: 200,
  },
  {
    id: 2,
    product: {
      id: 2,
    },
    location: {
      id: 1,
    },
    minQuantity: 20,
    reorderQuantity: 100,
  },
];

export const mockReceipts = [
  {
    id: "REC-001",
    supplier: "ABC Steel Suppliers",
    date: "2026-09-26",
    status: "DRAFT",
    items: [
      {
        productId: 1,
        productName: "Steel Rods",
        quantity: 100,
      },
    ],
  },
  {
    id: "REC-002",
    supplier: "Global Components",
    date: "2026-09-26",
    status: "WAITING",
    items: [
      {
        productId: 4,
        productName: "Machine Bolt",
        quantity: 200,
      },
    ],
  },
];

export const mockDeliveries = [
  {
    id: "DEL-001",
    customer: "XYZ Manufacturing",
    date: "2026-09-26",
    status: "READY",
    location: "Main Warehouse",
    items: [
      {
        productId: 1,
        productName: "Steel Rods",
        quantity: 20,
      },
    ],
  },
  {
    id: "DEL-002",
    customer: "ABC Industries",
    date: "2026-09-26",
    status: "DRAFT",
    location: "Main Warehouse",
    items: [
      {
        productId: 2,
        productName: "Chair Frame",
        quantity: 5,
      },
    ],
  },
];

export const mockTransfers = [
  {
    id: "TRF-001",
    sourceWarehouse: "Main Warehouse",
    sourceLocation: "Rack A",
    destinationWarehouse: "Main Warehouse",
    destinationLocation: "Production Rack",
    productId: 1,
    productName: "Steel Rods",
    quantity: 30,
    status: "DRAFT",
    date: "2026-09-26",
  },
];

export const mockAdjustments = [
  {
    id: "ADJ-001",
    productId: 1,
    productName: "Steel Rods",
    location: "Rack A",
    recordedQuantity: 150,
    physicalQuantity: 147,
    difference: -3,
    reason: "Damaged material",
    status: "DRAFT",
    date: "2026-09-26",
  },
];

export const mockMoveHistory = [
  {
    id: 1,
    date: "2026-09-26 10:30",
    product: "Steel Rods",
    source: "Supplier",
    destination: "Main Warehouse / Rack A",
    quantity: 100,
    type: "RECEIPT",
    reference: "REC-001",
    user: "Lalit",
    status: "DONE",
  },
  {
    id: 2,
    date: "2026-09-26 11:30",
    product: "Steel Rods",
    source: "Main Warehouse / Rack A",
    destination: "Main Warehouse / Production Rack",
    quantity: 30,
    type: "TRANSFER",
    reference: "TRF-001",
    user: "Lalit",
    status: "DONE",
  },
  {
    id: 3,
    date: "2026-09-26 12:15",
    product: "Steel Rods",
    source: "Main Warehouse",
    destination: "Customer",
    quantity: 20,
    type: "DELIVERY",
    reference: "DEL-001",
    user: "Lalit",
    status: "DONE",
  },
  {
    id: 4,
    date: "2026-09-26 12:45",
    product: "Steel Rods",
    source: "Main Warehouse / Rack A",
    destination: "Adjustment",
    quantity: 3,
    type: "ADJUSTMENT",
    reference: "ADJ-001",
    user: "Lalit",
    status: "DONE",
  },
];