import api from "./api";

import {
  mockProductService,
  mockCategoryService,
  mockUomService,
  mockStockService,
  mockReorderRuleService,
  mockReceiptService,
  mockDeliveryService,
  mockTransferService,
  mockAdjustmentService,
  mockMoveHistoryService,
} from "./mockOperationsService";

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK_API === "true";

/* =========================
   PRODUCTS
========================= */

const realProductService = {
  getAll: () =>
    api.get("/products"),

  getById: (id) =>
    api.get(`/products/${id}`),

  create: (data) =>
    api.post("/products", data),

  update: (id, data) =>
    api.put(`/products/${id}`, data),

  remove: (id) =>
    api.delete(`/products/${id}`),
};

export const productService =
  USE_MOCK
    ? mockProductService
    : realProductService;

/* =========================
   CATEGORIES
========================= */

const realCategoryService = {
  getAll: () =>
    api.get("/categories"),

  create: (data) =>
    api.post("/categories", data),
};

export const categoryService =
  USE_MOCK
    ? mockCategoryService
    : realCategoryService;

/* =========================
   UOM
========================= */

const realUomService = {
  getAll: () =>
    api.get("/uom"),

  create: (data) =>
    api.post("/uom", data),
};

export const uomService =
  USE_MOCK
    ? mockUomService
    : realUomService;

/* =========================
   STOCK
========================= */

const realStockService = {
  getAll: (params = {}) =>
    api.get("/stock", { params }),

  getByProduct: (productId) =>
    api.get("/stock", {
      params: { productId },
    }),

  getByLocation: (locationId) =>
    api.get("/stock", {
      params: { locationId },
    }),
};

export const stockService =
  USE_MOCK
    ? mockStockService
    : realStockService;

/* =========================
   REORDER RULES
========================= */

const realReorderRuleService = {
  getAll: () =>
    api.get("/reorder-rules"),

  create: (data) =>
    api.post("/reorder-rules", data),
};

export const reorderRuleService =
  USE_MOCK
    ? mockReorderRuleService
    : realReorderRuleService;

/* =========================
   RECEIPTS
========================= */

const realReceiptService = {
  getAll: () =>
    api.get("/receipts"),

  getById: (id) =>
    api.get(`/receipts/${id}`),

  create: (data) =>
    api.post("/receipts", data),

  validate: (id) =>
    api.post(`/receipts/${id}/validate`),
};

export const receiptService =
  USE_MOCK
    ? mockReceiptService
    : realReceiptService;

/* =========================
   DELIVERIES
========================= */

const realDeliveryService = {
  getAll: () =>
    api.get("/deliveries"),

  getById: (id) =>
    api.get(`/deliveries/${id}`),

  create: (data) =>
    api.post("/deliveries", data),

  validate: (id) =>
    api.post(`/deliveries/${id}/validate`),
};

export const deliveryService =
  USE_MOCK
    ? mockDeliveryService
    : realDeliveryService;

/* =========================
   TRANSFERS
========================= */

const realTransferService = {
  getAll: () =>
    api.get("/transfers"),

  create: (data) =>
    api.post("/transfers", data),

  validate: (id) =>
    api.post(`/transfers/${id}/validate`),
};

export const transferService =
  USE_MOCK
    ? mockTransferService
    : realTransferService;

/* =========================
   ADJUSTMENTS
========================= */

const realAdjustmentService = {
  getAll: () =>
    api.get("/adjustments"),

  create: (data) =>
    api.post("/adjustments", data),

  validate: (id) =>
    api.post(`/adjustments/${id}/validate`),
};

export const adjustmentService =
  USE_MOCK
    ? mockAdjustmentService
    : realAdjustmentService;

/* =========================
   MOVE HISTORY
========================= */

const realMoveHistoryService = {
  getAll: (params = {}) =>
    api.get("/stock-moves", {
      params,
    }),
};

export const moveHistoryService =
  USE_MOCK
    ? mockMoveHistoryService
    : realMoveHistoryService;