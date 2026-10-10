
import axiosClient from "./axiosClient";

export const getProductReviews = async (productId) => {
  const response = await axiosClient.get(`/ProductReview/product/${productId}`);
  return response.data;
};

export const getProductRating = async (productId) => {
  const response = await axiosClient.get(`/ProductReview/product/${productId}/rating`);
  return response.data;
};

export const createProductReview = async (reviewData) => {
  const response = await axiosClient.post("/ProductReview", reviewData);
  return response.data;
};

export const updateProductReview = async (reviewId, reviewData) => {
  const response = await axiosClient.put(`/ProductReview/${reviewId}`, reviewData);
  return response.data;
};

export const deleteProductReview = async (reviewId) => {
  const response = await axiosClient.delete(`/ProductReview/${reviewId}`);
  return response.data;
};
