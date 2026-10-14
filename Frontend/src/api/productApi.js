import api from "./axiosClient";
export const getProducts = async(params = {})=>{
    const response = await api.get("/Product",{ params });
    return response.data;
}
export const getProductsById = async(id)=>{
    const response = await api.get(`/product/${id}`);
    return response.data;
}

export const getProductSpecifications  = async(productId)=>{
    const response = await api.get(`/product-specifications/product/${productId}`);
    return response.data;
}

export const uploadProductImages = async (productId, files) => {
  const formData = new FormData();
  formData.append("ProductId", productId);
  for (const file of files) {
    formData.append("Images", file);
  }
  const response = await axiosClient.post("/Product/images", formData);
  return response.data;
};

export const deleteProductImage = async (imageId) => {
  const response = await axiosClient.delete(`/Product/images/${imageId}`);
  return response.data;
};
