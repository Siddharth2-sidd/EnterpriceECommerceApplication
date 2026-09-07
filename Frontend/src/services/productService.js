import api from "./api";
export const getProducts = async()=>{
    const response = await api.get("/Product");
    return response.data;
}
export const getProductsById = async(id)=>{
    const response = await api.get(`/product/${id}`);
    return response.data;
}