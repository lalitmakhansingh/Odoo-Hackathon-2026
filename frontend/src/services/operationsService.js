import api from "./api";

/* =========================
   PRODUCTS
========================= */

export const productService = {
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


/* =========================
   CATEGORIES
========================= */

export const categoryService = {
  getAll: () =>
    api.get("/categories"),

  create: (data) =>
    api.post("/categories", data),
};


/* =========================
   UNITS OF MEASURE
========================= */

export const uomService = {
  getAll: () =>
    api.get("/uom"),

  create: (data) =>
    api.post("/uom", data),
};


/* =========================
   REORDER RULES
========================= */

export const reorderRuleService = {
  getAll: () =>
    api.get("/reorder-rules"),

  create: (data) =>
    api.post("/reorder-rules", data),
};


/* =========================
   STOCK
========================= */

export const stockService = {
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


/* =========================
   RECEIPTS
========================= */

export const receiptService = {
  getAll: () =>
    api.get("/receipts"),

  getById: (id) =>
    api.get(`/receipts/${id}`),

  create: (data) =>
    api.post("/receipts", data),

  validate: (id) =>
    api.post(`/receipts/${id}/validate`),
};


/* =========================
   DELIVERIES
========================= */

export const deliveryService = {
  getAll: () =>
    api.get("/deliveries"),

  getById: (id) =>
    api.get(`/deliveries/${id}`),

  create: (data) =>
    api.post("/deliveries", data),

  validate: (id) =>
    api.post(`/deliveries/${id}/validate`),
};


/* =========================
   TRANSFERS
========================= */

export const transferService = {
  getAll: () =>
    api.get("/transfers"),

  create: (data) =>
    api.post("/transfers", data),

  validate: (id) =>
    api.post(`/transfers/${id}/validate`),
};


/* =========================
   ADJUSTMENTS
========================= */

export const adjustmentService = {
  getAll: () =>
    api.get("/adjustments"),

  create: (data) =>
    api.post("/adjustments", data),

  validate: (id) =>
    api.post(`/adjustments/${id}/validate`),
};


/* =========================
   MOVE HISTORY
========================= */

export const moveHistoryService = {
  getAll: (params = {}) =>
    api.get("/stock-moves", { params }),
};