import {createContext, useContext, useState} from "react";
import {refreshAccessToken} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToekn"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));

    const login = (accessToken, refreshToken) =>{
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const refresh = async()=>{
        if(!refreshToken){
            return null;
        }
        try{
            const response = await refreshAccessToken(refreshToken);
            const newAccessToken = response.accessToken;
            const newrefreshToken  = response.refreshToken || refreshToken;
            login(newAccessToken, newrefreshToken);
            return newAccessToken;
        }catch(error){
            logout();
            return null;
        }

    }

    const logout = ()=>{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setAccessToken(null);
        setRefreshToken(null);
    };
    return(
            <AuthContext.Provider value={{accessToken, refreshToken, login, logout, refresh}}>{children}</AuthContext.Provider>
    );
};

export const useAuth = ()=>{
    return useContext(AuthContext);
};