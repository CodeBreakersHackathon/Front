import React, { useState, useEffect } from "react";  // Añadido useEffect
import "./LoginPage.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";
import { Mail, Lock, Loader, X } from 'lucide-react';
import { API_URL } from "./apiConstants";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const images = [
    '/imagenes/1.jpg',
    '/imagenes/2.jpg',
    '/imagenes/3.jpg',
    '/imagenes/4.jpg',
    '/imagenes/5.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error en el inicio de sesión`);
      }
  
      const data = await response.json();
      const { access_token } = data;
      
      if (access_token) {
        const tokenParts = access_token.split('.');
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        const userId = tokenPayload.sub;
  
        const userData = {
          access_token,
          userId,
        };
  
        localStorage.setItem("token", access_token);
        localStorage.setItem("userData", JSON.stringify(userData));
        Cookies.set("access_token", access_token);
  
        login();
        setAlert({
          show: true,
          message: "¡Inicio de sesión exitoso!",
          type: "success"
        });
        
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error("No se ha recibido el token de acceso");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlert({
        show: true,
        message: error.message,
        type: "error"
      });

      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <AnimatePresence>
        {alert.show && (
          <motion.div 
            className={`custom-alert ${alert.type}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="alert-message">{alert.message}</div>
            <button 
              onClick={() => setAlert({ show: false, message: "", type: "" })}
              className="alert-close-btn"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="login-image">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`Login Illustration ${currentImageIndex + 1}`}
            className="login-img"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
          />
        </AnimatePresence>
      </div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2 
          className="login-title"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Bienvenido de nuevo
        </motion.h2>
        <form className="login-form" onSubmit={handleLogin}>
          <motion.div 
            className="form-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-with-icon"
              />
            </div>
          </motion.div>

          <motion.div 
            className="form-group"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-with-icon"
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="btn-login"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader size={20} />
              </motion.div>
            ) : (
              "Iniciar Sesión"
            )}
          </motion.button>
        </form>

        <motion.p 
          className="register-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="register-link-text">
            Regístrate aquí
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default LoginPage;