import api from "./api";

const operationService = {
  getReceipts: () => {
    return api.get("/receipts");
  },

  getReceipt: (id) => {
    return api.get(`/receipts/${id}`);
  },

  createReceipt: (data) => {
    return api.post("/receipts", data);
  },

  validateReceipt: (id) => {
    return api.post(`/receipts/${id}/validate`);
  },

  getDeliveries: () => {
    return api.get("/deliveries");
  },

  getDelivery: (id) => {
    return api.get(`/deliveries/${id}`);
  },

  createDelivery: (data) => {
    return api.post("/deliveries", data);
  },

  validateDelivery: (id) => {
    return api.post(`/deliveries/${id}/validate`);
  },

  getTransfers: () => {
    return api.get("/transfers");
  },

  createTransfer: (data) => {
    return api.post("/transfers", data);
  },

  validateTransfer: (id) => {
    return api.post(`/transfers/${id}/validate`);
  },

  getAdjustments: () => {
    return api.get("/adjustments");
  },

  createAdjustment: (data) => {
    return api.post("/adjustments", data);
  },

  validateAdjustment: (id) => {
    return api.post(`/adjustments/${id}/validate`);
  },
};

export default operationService;