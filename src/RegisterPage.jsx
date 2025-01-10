import React, { useState, useEffect } from "react";
import "./RegisterPage.css";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    phone: "",
  });

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
  }, [images.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <div className="register-page">
      <div className="register-image">
        <img
          src={images[currentImageIndex]}
          alt="Registro"
          className="register-img"
        />
        <div className="register-link">
          <p>¿Ya tienes una cuenta?</p>
          <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>

      <div className="register-container">
        <h2 className="register-title">Bienvenido a Handin! Crea tu cuenta</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombres">Nombres</label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              placeholder="Ingresa tus nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              placeholder="Ingresa tus apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Crea una contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">Ciudad</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Ingresa tu ciudad"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Ingresa tu teléfono"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-register">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
