import api from "./api";

const productService = {
  getAll: () => {
    return api.get("/products");
  },

  getById: (id) => {
    return api.get(`/products/${id}`);
  },

  create: (data) => {
    return api.post("/products", data);
  },

  update: (id, data) => {
    return api.put(`/products/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/products/${id}`);
  },
};

export default productService;