import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useStorageState } from "./util/useLocalStorage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [[_, token], setToken] = useStorageState("access_token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Leer la cookie al cargar la página
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true); // Si hay token, el usuario está autenticado
    }
  }, [token]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null)
    Cookies.remove("access_token");
  };

  console.log("authorization", token)
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
