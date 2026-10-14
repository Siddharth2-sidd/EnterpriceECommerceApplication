
import axiosClient from "./axiosClient";

// Create a payment record for an order.
// Match paymentData to CreatePaymentRequestDto in Swagger.
export const createPayment = async (paymentData) => {
  const response = await axiosClient.post("/payments", paymentData);
  return response.data;
};

// Get the payment associated with an order.
export const getPaymentByOrderId = async (orderId) => {
  const response = await axiosClient.get(`/payments/order/${orderId}`);
  return response.data;
};

// Ask the backend to process a payment.
export const processPayment = async (paymentId) => {
  const response = await axiosClient.post(`/payments/${paymentId}/process`);
  return response.data;
};

// Refund requests should normally be restricted to authorized users
// and validated by the backend.
export const refundPayment = async (paymentId, requestData) => {
  const response = await axiosClient.post(`/payments/${paymentId}/refund`, requestData);
  return response.data;
};
