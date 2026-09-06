import api from "./api";
export const getProducts = async()=>{
    const response = await api.get("/Product");
    return response.data;
}