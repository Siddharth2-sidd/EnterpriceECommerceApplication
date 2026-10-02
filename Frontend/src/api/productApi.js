import api from "./axiosClient";
export const getProducts = async(params = {})=>{
    const response = await api.get("/Product",{ params });
    return response.data;
}
export const getProductsById = async(id)=>{
    const response = await api.get(`/product/${id}`);
    return response.data;
}