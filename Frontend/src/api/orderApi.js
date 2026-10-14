
import axiosClient from "./axiosClient";

// Place an order using the selected address and payment method.
export const checkoutOrder = async (addressId, paymentMethod) => {
  const response = await axiosClient.post("/Order/checkout", null, {
    params: {
      AddressId: addressId,
      PaymentMethod: paymentMethod,
    },
  });

  return response.data;
};

// Get the logged-in user's orders (used in Step 24).
export const getOrders = async () => {
  const response = await axiosClient.get("/Order");
  return response.data;
};

// Get a single order's details (used in Step 24).
export const getOrderById = async (orderId) => {
  const response = await axiosClient.get(`/Order/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId, reason) => {
  const response = await axiosClient.put(`/Order/${orderId}/cancel`,  null,{params: { Reason: reason },});
  return response.data;
};
