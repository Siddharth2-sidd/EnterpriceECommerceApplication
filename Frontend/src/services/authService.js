import api from "./api";

export const registerUser  = async (userData)=>{
    const response = await  api.post("/Auth/Register",userData);
    return response.data;
}

export const loginUser = async(userData)=>{
    const response = await api.post("/Auth/Login",userData);
    return response.data;
}

export const refreshAccessToken = async(refreshToken)=>{
    const response = await api.post("/Auth/refresh-token",{refreshToken});
    return response.data;
}