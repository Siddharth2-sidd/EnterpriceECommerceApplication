import axios from "axios";
const axiosClient = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    headers:{"Content-Type": "application/json"}
});

axiosClient.interceptors.request.use((config)=>{

    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},
    (error)=>{
        return Promise.reject(error);
    }
);

export default axiosClient;
