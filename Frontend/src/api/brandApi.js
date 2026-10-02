import axiosClient from "./axiosClient";

export const getBrands = async (params={}) =>{
    const response = await axiosClient.get("/Brand",{params,});
    return response.data;
};

export const getBrandById = async(id)=>{
    const response = await axiosClient.get(`/Brand/${id}`);
    return response.data;
}