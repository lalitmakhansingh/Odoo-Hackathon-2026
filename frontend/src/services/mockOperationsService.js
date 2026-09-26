import {
  mockCategories,
  mockUoms,
  mockProducts,
  mockStock,
  mockReorderRules,
  mockReceipts,
  mockDeliveries,
  mockTransfers,
  mockAdjustments,
  mockMoveHistory,
} from "../data/mockData";

let products = [...mockProducts];
let receipts = [...mockReceipts];
let deliveries = [...mockDeliveries];
let transfers = [...mockTransfers];
let adjustments = [...mockAdjustments];
let moveHistory = [...mockMoveHistory];
let reorderRules = [...mockReorderRules];

function response(data, message = "Success") {
  return {
    data: {
      success: true,
      message,
      data,
    },
  };
}

/* =========================
   PRODUCTS
========================= */

export const mockProductService = {
  getAll: async () =>
    response(products, "Products retrieved"),

  getById: async (id) => {
    const product = products.find(
      (item) => item.id === Number(id)
    );

    return response(
      product,
      "Product details loaded"
    );
  },

  create: async (data) => {
    const category =
      mockCategories.find(
        (item) =>
          item.id === Number(data.category.id)
      );

    const unitOfMeasure =
      mockUoms.find(
        (item) =>
          item.id ===
          Number(data.unitOfMeasure.id)
      );

    const product = {
      id: Date.now(),
      name: data.name,
      sku: data.sku,
      category,
      unitOfMeasure,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(product);

    return response(
      product,
      "Product created successfully"
    );
  },

  update: async (id, data) => {
    const index = products.findIndex(
      (item) => item.id === Number(id)
    );

    if (index === -1) {
      throw new Error("Product not found");
    }

    const category =
      mockCategories.find(
        (item) =>
          item.id === Number(data.category.id)
      );

    const unitOfMeasure =
      mockUoms.find(
        (item) =>
          item.id ===
          Number(data.unitOfMeasure.id)
      );

    products[index] = {
      ...products[index],
      name: data.name,
      category,
      unitOfMeasure,
      description: data.description,
      updatedAt: new Date().toISOString(),
    };

    return response(
      products[index],
      "Product updated successfully"
    );
  },

  remove: async (id) => {
    products = products.filter(
      (item) => item.id !== Number(id)
    );

    return response(
      null,
      "Product deleted successfully"
    );
  },
};

/* =========================
   CATEGORIES
========================= */

export const mockCategoryService = {
  getAll: async () =>
    response(
      mockCategories,
      "Categories retrieved"
    ),

  create: async (data) => {
    const category = {
      id: Date.now(),
      name: data.name,
      description: data.description || "",
    };

    mockCategories.push(category);

    return response(
      category,
      "Category created successfully"
    );
  },
};

/* =========================
   UOM
========================= */

export const mockUomService = {
  getAll: async () =>
    response(
      mockUoms,
      "Units retrieved"
    ),

  create: async (data) => {
    const uom = {
      id: Date.now(),
      name: data.name,
      code: data.code,
    };

    mockUoms.push(uom);

    return response(
      uom,
      "Unit created successfully"
    );
  },
};

/* =========================
   STOCK
========================= */

export const mockStockService = {
  getAll: async (params = {}) => {
    let result = [...mockStock];

    if (params.productId) {
      result = result.filter(
        (item) =>
          item.productId ===
          Number(params.productId)
      );
    }

    if (params.locationId) {
      result = result.filter(
        (item) =>
          item.locationId ===
          Number(params.locationId)
      );
    }

    return response(
      result,
      "Stock retrieved"
    );
  },

  getByProduct: async (productId) =>
    response(
      mockStock.filter(
        (item) =>
          item.productId === Number(productId)
      ),
      "Product stock retrieved"
    ),

  getByLocation: async (locationId) =>
    response(
      mockStock.filter(
        (item) =>
          item.locationId === Number(locationId)
      ),
      "Location stock retrieved"
    ),
};

/* =========================
   REORDER RULES
========================= */

export const mockReorderRuleService = {
  getAll: async () =>
    response(
      reorderRules,
      "Reorder rules retrieved"
    ),

  create: async (data) => {
    const rule = {
      id: Date.now(),
      ...data,
    };

    reorderRules.push(rule);

    return response(
      rule,
      "Reorder rule created"
    );
  },
};

/* =========================
   RECEIPTS
========================= */

export const mockReceiptService = {
  getAll: async () =>
    response(
      receipts,
      "Receipts retrieved"
    ),

  getById: async (id) =>
    response(
      receipts.find(
        (item) => item.id === id
      ),
      "Receipt loaded"
    ),

  create: async (data) => {
    const receipt = {
      id: `REC-${String(
        receipts.length + 1
      ).padStart(3, "0")}`,
      date: new Date()
        .toISOString()
        .split("T")[0],
      status: "DRAFT",
      ...data,
    };

    receipts.push(receipt);

    return response(
      receipt,
      "Receipt created successfully"
    );
  },

  validate: async (id) => {
    receipts = receipts.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "DONE",
          }
        : item
    );

    return response(
      null,
      "Receipt validated successfully"
    );
  },
};

/* =========================
   DELIVERIES
========================= */

export const mockDeliveryService = {
  getAll: async () =>
    response(
      deliveries,
      "Deliveries retrieved"
    ),

  getById: async (id) =>
    response(
      deliveries.find(
        (item) => item.id === id
      ),
      "Delivery loaded"
    ),

  create: async (data) => {
    const delivery = {
      id: `DEL-${String(
        deliveries.length + 1
      ).padStart(3, "0")}`,

      date: new Date()
        .toISOString()
        .split("T")[0],

      status: "DRAFT",

      ...data,
    };

    deliveries.push(delivery);

    return response(
      delivery,
      "Delivery created successfully"
    );
  },

  validate: async (id) => {
    const delivery =
      deliveries.find(
        (item) => item.id === id
      );

    if (!delivery) {
      throw new Error(
        "Delivery not found"
      );
    }

    const item =
      delivery.items?.[0];

    if (!item) {
      throw new Error(
        "Delivery has no items"
      );
    }

    const stockIndex =
      mockStock.findIndex(
        (stockItem) =>
          stockItem.productId ===
            Number(item.productId) &&
          stockItem.locationName ===
            delivery.location
      );

    if (stockIndex === -1) {
      throw new Error(
        "Stock location not found"
      );
    }

    const available =
      Number(
        mockStock[stockIndex].quantity
      );

    const quantity =
      Number(item.quantity);

    if (quantity > available) {
      throw new Error(
        "Insufficient stock"
      );
    }

    // Reduce stock
    mockStock[stockIndex].quantity =
      available - quantity;

    // Mark delivery completed
    deliveries =
      deliveries.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "DONE",
            }
          : item
      );

    // Add ledger entry
    moveHistory.push({
      id: Date.now(),
      date: new Date().toISOString(),
      product:
        item.productName,
      source:
        delivery.location,
      destination:
        delivery.customer,
      quantity,
      type: "DELIVERY",
      reference: delivery.id,
      user: "Lalit",
      status: "DONE",
    });

    return response(
      null,
      "Delivery validated successfully"
    );
  },
};
/* =========================
   TRANSFERS
========================= */

export const mockTransferService = {
  getAll: async () =>
    response(
      transfers,
      "Transfers retrieved"
    ),

  create: async (data) => {
    const transfer = {
      id: `TRF-${String(
        transfers.length + 1
      ).padStart(3, "0")}`,
      date: new Date()
        .toISOString()
        .split("T")[0],
      status: "DRAFT",
      ...data,
    };

    transfers.push(transfer);

    return response(
      transfer,
      "Transfer created successfully"
    );
  },

  validate: async (id) => {
    transfers = transfers.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "DONE",
          }
        : item
    );

    return response(
      null,
      "Transfer validated successfully"
    );
  },
};

/* =========================
   ADJUSTMENTS
========================= */

export const mockAdjustmentService = {
  getAll: async () =>
    response(
      adjustments,
      "Adjustments retrieved"
    ),

  create: async (data) => {
    const difference =
      Number(data.physicalQuantity) -
      Number(data.recordedQuantity);

    const adjustment = {
      id: `ADJ-${String(
        adjustments.length + 1
      ).padStart(3, "0")}`,
      date: new Date()
        .toISOString()
        .split("T")[0],
      status: "DRAFT",
      ...data,
      difference,
    };

    adjustments.push(adjustment);

    return response(
      adjustment,
      "Adjustment created successfully"
    );
  },

  validate: async (id) => {
    adjustments = adjustments.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "DONE",
          }
        : item
    );

    return response(
      null,
      "Adjustment validated successfully"
    );
  },
};

/* =========================
   MOVE HISTORY
========================= */

export const mockMoveHistoryService = {
  getAll: async () =>
    response(
      moveHistory,
      "Move history retrieved"
    ),
};