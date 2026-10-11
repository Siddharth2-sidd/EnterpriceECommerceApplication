
import axiosClient from "./axiosClient";

export const getAddresses = async () => {
  const response = await axiosClient.get("/Address");
  return response.data;
};

export const createAddress = async (addressData) => {
  const response = await axiosClient.post("/Address", addressData);
  return response.data;
};

export const updateAddress = async (addressId, addressData) => {
  const response = await axiosClient.put(`/Address/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await axiosClient.delete(`/Address/${addressId}`);
  return response.data;
};

export const setDefaultAddress = async (addressId) => {
  const response = await axiosClient.put(`/Address/${addressId}/default`);
  return response.data;
};
