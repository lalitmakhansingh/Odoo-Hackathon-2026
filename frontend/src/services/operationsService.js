import api from "./api";

/*
 * Product APIs
 * Backend owner: Member 1
 */

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


/*
 * Stock APIs
 * Backend owner: Member 2
 */

export const stockService = {
  getAll: () =>
    api.get("/stock"),

  getByProduct: (productId) =>
    api.get(`/stock/product/${productId}`),

  getByLocation: (locationId) =>
    api.get(`/stock/location/${locationId}`),
};


/*
 * Receipt APIs
 */

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


/*
 * Delivery APIs
 */

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


/*
 * Internal Transfer APIs
 */

export const transferService = {
  getAll: () =>
    api.get("/transfers"),

  create: (data) =>
    api.post("/transfers", data),

  validate: (id) =>
    api.post(`/transfers/${id}/validate`),
};


/*
 * Inventory Adjustment APIs
 */

export const adjustmentService = {
  getAll: () =>
    api.get("/adjustments"),

  create: (data) =>
    api.post("/adjustments", data),

  validate: (id) =>
    api.post(`/adjustments/${id}/validate`),
};


/*
 * Move History
 *
 * The backend plan defines the stock_moves database table,
 * but an exact GET endpoint was not specified.
 *
 * We therefore keep the endpoint configurable.
 */

const MOVE_HISTORY_ENDPOINT =
  import.meta.env.VITE_MOVE_HISTORY_ENDPOINT ||
  "/stock-moves";

export const moveHistoryService = {
  getAll: () =>
    api.get(MOVE_HISTORY_ENDPOINT),
};