import axiosClient from "./axiosClient";

// These routes must match the paths shown in your Swagger UI.
export const getAdminOrders = async (params = {}) => {
  const response = await axiosClient.get("/admin/orders", {params,});
  return response.data;
};

export const getAdminProducts = async (params = {}) => {
  const response = await axiosClient.get("/admin/products", {params,});
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await axiosClient.get("/admin/users", {params,});
  return response.data;
};
