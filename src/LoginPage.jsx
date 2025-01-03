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
    console.log("Email:", email);
    console.log("Password:", password);
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

      switch (response.status) {
        case 200:
          const data = await response.json();
          alert("Inicio de sesión exitoso");
          console.log(data);
          Cookies.set("access_token", data.access_token); // Guarda el token en las cookies
          login(); // Actualiza el estado global de autenticación
          navigate("/"); // Redirige al home
          break;
        case 401:
          alert("Credenciales incorrectas");
          break;
        default:
          const errorData = await response.json();
          console.error("Error en el inicio de sesión:", errorData);
          throw new Error(errorData.message || "Error al iniciar sesión");
      }
    } catch (error) {
      alert(error);
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
