import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useStorageState } from "./util/useLocalStorage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [[_, token], setToken] = useStorageState("access_token");
  const [[__, userData], setUserData] = useStorageState("userData");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      try {
        const tokenParts = token.split('.');
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        setUserRole(tokenPayload.role);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, [token]);

  const login = (newToken) => {
    setIsLoggedIn(true);
    setToken(newToken);
    try {
      const tokenParts = newToken.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      setUserRole(tokenPayload.role);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setToken(null);
    setUserData(null);
    localStorage.removeItem("userData");
    Cookies.remove("access_token");
  };

  console.log("authorization", token);
  console.log("user role", userRole);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}