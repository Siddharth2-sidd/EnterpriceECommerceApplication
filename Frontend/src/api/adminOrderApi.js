import axiosClient from "./axiosClient";

// GET /api/admin/orders
export const getAdminOrders = async (params = {}) => {
  const response = await axiosClient.get("/admin/orders", { params });
  return response.data;
};

// PUT /api/admin/orders/{orderId}/status
export const updateAdminOrderStatus = async (orderId, status) => {
  const response = await axiosClient.put(`/admin/orders/${orderId}/status`,  { status });
  return response.data;
};

// PUT /api/admin/orders/{orderId}/payment-status
export const updateAdminPaymentStatus = async (orderId,paymentStatus) => {
  const response = await axiosClient.put(`/admin/orders/${orderId}/payment-status`,{ paymentStatus });
  return response.data;
};

// Cancellation endpoint: verify the spelling in Swagger first.
export const cancelAdminOrder = async (orderId, reason) => {
  const response = await axiosClient.put(`/admin/orders/${orderId}/cacel`, { reason });
  return response.data;
};
