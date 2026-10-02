import axiosClient from "./axiosClient";
export const getCategories = async (params ={})=>{
  const response = await axiosClient.get("/Category",{params,});
  return response.data;
}

export const getCategoryById = async (id)=>{
  const response = await axiosClient.get(`/Category/${id}`);
  return response.data;
}