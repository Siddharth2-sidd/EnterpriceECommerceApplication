import axiosClient from "./axiosClient";

export const getWishlist = async () => {
  const response = await axiosClient.get("/Wishlist");
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axiosClient.post(`/Wishlist/${productId}`);
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await axiosClient.delete(`/Wishlist/${productId}`);
  return response.data;
};

export const isProductInWishlist = async (productId) => {
  const response = await axiosClient.get(`/Wishlist/${productId}/exists`);
  return response.data;
};
