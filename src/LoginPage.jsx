import React, { useState } from "react";
import "./LoginPage.css";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext"; // Importa el contexto de autenticación

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Extrae la función de inicio de sesión del contexto
  const navigate = useNavigate(); // Hook para redireccionar

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const { access_token } = data;
      
      if (access_token) {
        // Decodificar el token JWT para obtener la información del usuario
        const tokenParts = access_token.split('.');
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        
        // Extraer userId del campo 'sub' del token
        const userId = tokenPayload.sub;
        
        console.log("Token payload:", tokenPayload);
        console.log("User ID from token:", userId);
  
        const userData = {
          access_token,
          userId,
          // Por ahora no tenemos el role, necesitarás agregarlo en el backend
        };
  
        localStorage.setItem("token", access_token);
        localStorage.setItem("userData", JSON.stringify(userData));
        
        Cookies.set("access_token", access_token);
  
        login();
        navigate("/");
      } else {
        throw new Error("No se ha recibido el token de acceso");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message);
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-image">
        {/* Espacio para la imagen */}
        <img
          src="/path/to/your/image.png" // Cambia por la ruta de tu imagen
          alt="Login Illustration"
          className="login-img"
        />
      </div>
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="login-title">Inicia Sesión</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            className="btn-login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Iniciar Sesión
          </motion.button>
        </form>

        <p className="register-link">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="register-link-text">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
