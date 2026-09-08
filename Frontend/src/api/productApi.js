import api from "./axiosClient";
export const getProducts = async()=>{
    const response = await api.get("/Product");
    return response.data;
}
export const getProductsById = async(id)=>{
    const response = await api.get(`/product/${id}`);
    return response.data;
}