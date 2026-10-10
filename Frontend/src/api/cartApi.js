
import axiosClient from "./axiosClient";

export const getCart = async () => {
  const response = await axiosClient.get("/Cart");
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await axiosClient.post("/Cart/addItems", {
    productId: Number(productId),
    quantity: Number(quantity),
  });
  return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await axiosClient.put("/Cart/updateItems", {
    cartItemId: Number(cartItemId),
    quantity: Number(quantity),
  });
  return response.data;
};

export const removeCartItem = async (cartItemId) => {
  const response = await axiosClient.delete(`/Cart/items/${cartItemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosClient.delete("/Cart");
  return response.data;
};
