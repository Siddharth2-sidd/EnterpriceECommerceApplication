import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("fullName");
    const role = localStorage.getItem("role");
    if (token) {
      setAccessToken(token);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if(role){
      setRole(role);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
  const handleAuthLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };
  window.addEventListener("auth:logout", handleAuthLogout);
  return () => {
    window.removeEventListener( "auth:logout", handleAuthLogout);
  };
}, []);

  const login = async (email, password) => {
    const response = await loginUser({email, password,});
    // console.log("Login response:", response);
    const token = response.token;
    const refreshToken = response.refreshToken;
    const role = response.role;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);

    setAccessToken(token);
    if (response.fullName) {
      // console.log(JSON.stringify(response.fullName))
      localStorage.setItem("fullName", JSON.stringify(response.fullName));
      setUser(response.fullName);
    }

    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setAccessToken(null);
    setUser(null);
  };

  return (
    <>
    <AuthContext.Provider value={{role,user, accessToken, loading, login, logout, isAuthenticated: !!accessToken, }}>
      {children}
    </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};