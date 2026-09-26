import api from "./api";

const inventoryService = {
  getStock: () => {
    return api.get("/stock");
  },

  getStockByProduct: (productId) => {
    return api.get(`/stock/product/${productId}`);
  },

  getStockByLocation: (locationId) => {
    return api.get(`/stock/location/${locationId}`);
  },

  getReceipts: () => {
    return api.get("/receipts");
  },

  getDeliveries: () => {
    return api.get("/deliveries");
  },

  getTransfers: () => {
    return api.get("/transfers");
  },

  getAdjustments: () => {
    return api.get("/adjustments");
  },
};

export default inventoryService;
