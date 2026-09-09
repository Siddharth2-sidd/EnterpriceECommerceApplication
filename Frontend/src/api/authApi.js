import axiosClient from "./axiosClient";

export const registerUser  = async (userData)=>{
    const response = await  axiosClient.post("/Auth/Register",userData);
    return response.data;
};

export const loginUser = async(userData)=>{
    const response = await axiosClient.post("/Auth/Login",userData);
    return response.data;
};

export const refreshAccessToken = async(refreshToken)=>{
    const response = await axiosClient.post("/Auth/refresh-token",{refreshToken});
    return response.data;
};

export const forgotPassword = async (data) => {
  const response = await axiosClient.post("/Auth/forget-password",  data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axiosClient.post("/Auth/reset-password", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axiosClient.post("/Auth/change-password", data);
  return response.data;
};

export const verifyEmail = async (data) => {
  const response = await axiosClient.post("/Auth/verify-email", data);
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await axiosClient.post(`/Auth/resend-verification?email=${encodeURIComponent(email)}`);
  return response.data;
};