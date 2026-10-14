import axiosClient from "./axiosClient";

export const getAdminProducts = async (params = {}) => {
  const response = await axiosClient.get("/admin/products", { params});
  return response.data;
};

export const createAdminProduct = async (productData) => {
  const response = await axiosClient.post("/admin/products", productData);
  return response.data;
};

export const updateAdminProduct = async (productId, productData) => {
  const response = await axiosClient.put(`/admin/products/${productId}`, productData);
  return response.data;
};

export const deleteAdminProduct = async (productId) => {
  const response = await axiosClient.delete(`/admin/products/${productId}`);
  return response.data;
};

export const adjustProductStock = async (productId, stockData) => {
  const response = await axiosClient.put(`/admin/products/${productId}/stock`, stockData);
  return response.data;
};
