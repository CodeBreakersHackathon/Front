import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import "./ContactPage.css";

function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.nombre || !formData.email || !formData.mensaje) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      await emailjs.send(
        "service_rsy3gma",
        "template_72ur8i9",
        {
          from_name: formData.nombre,
          from_email: formData.email,
          message: formData.mensaje
        },
        "EizHqLe52HpbdMVFD"
      );

      alert("¡Mensaje enviado con éxito!");
      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("Error al enviar el mensaje. Intente nuevamente.");
    }
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="contact-title"
        >
          Contáctanos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="contact-description"
        >
          Estamos aquí para ayudarte. Escríbenos y nos pondremos en contacto contigo.
        </motion.p>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <motion.form
          className="contact-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          onSubmit={handleSubmit}
        >
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />

          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Tu correo electrónico"
            required
          />

          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows="5"
            placeholder="Escribe tu mensaje aquí..."
            required
          ></textarea>

          <motion.button
            type="submit"
            className="contact-submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Enviar Mensaje
          </motion.button>
        </motion.form>
      </section>

      {/* Additional Info */}
      <section className="contact-info">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="info-title"
        >
          Otras formas de contactarnos
        </motion.h2>
        <motion.ul
          className="info-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <li>📞 Teléfono: +51 123 456 789</li>
          <li>📧 Correo: contacto@handin.com</li>
          <li>📍 Dirección: Lima, Perú</li>
        </motion.ul>
      </section>


    </div>
  );
}

export default ContactPage;
