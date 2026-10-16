import axiosClient from "./axiosClient";

// List users. Adjust pagination and search parameter names to Swagger.
export const getAdminUsers = async (params = {}) => {
  const response = await axiosClient.get("/admin/users", {params,});
  return response.data;
};

// Activate a user account.
export const activateUser = async (userId) => {
  const response = await axiosClient.put(`/admin/users/${userId}/activate`);
  return response.data;
};

// Deactivate a user account.
export const deactivateUser = async (userId) => {
  const response = await axiosClient.put(`/admin/users/${userId}/deactivate`);
  return response.data;
};

// Change a user's role.
// Replace the request body with your exact backend DTO.
export const changeUserRole = async (userId, roleId) => {
  const response = await axiosClient.put(`/admin/users/${userId}/role`, { roleId :roleId });
  return response.data;
};
