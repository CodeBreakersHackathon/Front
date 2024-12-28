import React, { useState } from "react";
import "./RegisterPage.css";
import Cookies from "js-cookie";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
          email: formData.email,
          password: formData.password,
        }),
      });

      switch (response.status) {
        case 200:
          const data = await response.json();
          alert("Inicio de sesión exitoso");
          console.log(data);
          Cookies.set("access_token", data.access_token);
          window.location.href = "/";
          break;
        case 401:
          alert("Credenciales incorrectos");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.nombres,
          lastName: formData.apellidos,
          email: formData.email,
          password: formData.password,
          role: "user", // harcodeado
          city: formData.city,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);
        throw new Error(errorData.message || "Error al registrar el usuario");
      }

      const data = await response.json();
      alert("Registro exitoso");
      console.log(data);
      await handleLogin(e);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al registrar el usuario");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>

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

        <label htmlFor="city">Ciudad</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Ingresa tu ciudad"
          value={formData.city}
          onChange={handleChange}
        />

        <label htmlFor="phone">Teléfono</label>
        <input
          type="text"
          id="phone"
          name="phone"
          placeholder="Ingresa tu teléfono"
          value={formData.phone}
          onChange={handleChange}
        />

        <button type="submit" className="btn-register">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
