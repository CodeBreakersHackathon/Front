import React, { useState, useEffect } from "react";
import "./RegisterPage.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, FlagIcon, House } from "lucide-react";
import { API_URL } from "./apiConstants";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    country: "",
    city: "",
    phone: "",
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/imagenes/1.jpg",
    "/imagenes/2.jpg",
    "/imagenes/3.jpg",
    "/imagenes/4.jpg",
    "/imagenes/5.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showAlert("Las contraseñas no coinciden", "error");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.nombres,
          lastName: formData.apellidos,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          phone: formData.phone,
          role: "user",
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar");
      }
  
      showAlert("Registro exitoso", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      showAlert(error.message, "error");
    }
  };
  

  return (
    <div className="register-page">
      <AnimatePresence>
        {alert.show && (
          <motion.div
            className={`custom-alert ${alert.type}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            <div>{alert.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="register-image">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt={`Illustration ${currentImageIndex + 1}`}
          className="register-img"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          
        />
        <div className="register-link-box">
        <p>¿Ya tienes una cuenta?</p>
        <Link to="/login" className="register-link-button">Inicia sesión aquí</Link>
      </div>
      </div>

      <motion.div
        className="register-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2 className="register-title">Bienvenido a Handin! Crea tu cuenta</motion.h2>

        <form className="register-form" onSubmit={handleSubmit}>
          {[
            { name: "nombres", label: "Nombres", icon: <User size={18} /> },
            { name: "apellidos", label: "Apellidos", icon: <User size={18} /> },
            { name: "email", label: "Correo Electrónico", icon: <Mail size={18} /> },
            { name: "password", label: "Contraseña", icon: <Lock size={18} /> },
            {
              name: "confirmPassword",
              label: "Confirmar Contraseña",
              icon: <Lock size={18} />,
            },
            { name: "address", label: "Dirección", icon: <House size={18} /> },
            { name: "country", label: "País", icon: <FlagIcon size={18} /> },
            { name: "city", label: "Ciudad", icon: <MapPin size={18} /> },
            { name: "phone", label: "Teléfono", icon: <Phone size={18} /> },
          ].map((field, index) => (
            <motion.div
              key={field.name}
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <label htmlFor={field.name}>{field.label}</label>
              <div className="input-wrapper">
                {field.icon}
                <input
                  type={field.name.includes("password") ? "password" : "text"}
                  id={field.name}
                  name={field.name}
                  placeholder={`Ingresa ${field.label.toLowerCase()}`}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="input-with-icon"
                />
              </div>
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="btn-register"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Registrarse
          </motion.button>
        </form>

        <motion.p
          className="login-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
        </motion.p>
        
      </motion.div>
    </div>
  );
}

export default RegisterPage;