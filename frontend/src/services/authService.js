import api from "./api";

const authService = {
  login: (data) => {
    return api.post("/auth/login", data);
  },

  signup: (data) => {
    return api.post("/auth/signup", data);
  },

  sendOTP: (data) => {
    return api.post("/auth/send-otp", data);
  },

  verifyOTP: (data) => {
    return api.post("/auth/verify-otp", data);
  },

  resetPassword: (data) => {
    return api.post("/auth/reset-password", data);
  },

  getProfile: () => {
    return api.get("/users/me");
  },

  updateProfile: (data) => {
    return api.put("/users/me", data);
  },
};

export default authService;