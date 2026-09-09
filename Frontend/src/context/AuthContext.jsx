import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (token) {
      setAccessToken(token);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginUser({email, password,});
    console.log("Login response:", response);

    const token = response.accessToken;
    const refreshToken = response.refreshToken;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);

    setAccessToken(token);

    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
    }

    return response;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, accessToken, loading, login, logout, isAuthenticated: !!accessToken, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};