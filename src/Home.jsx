import React from "react";
import { motion } from "framer-motion";
import { Globe, Award, Calendar, Users, Book, Clock, Medal, Star } from 'lucide-react';
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section - Actualizar video de fondo según el tema de tu plataforma */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted>
          <source src="/src/assets/videos/hero-background.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
        <div className="hero-overlay">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="hero-title"
          >
            Handin: Conectamos conocimiento
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="hero-description"
          >
            Accede a eventos educativos desde cualquier lugar, en vivo o grabados.
          </motion.p>
          <motion.a
            href="/register"
            className="hero-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Regístrate Ahora
          </motion.a>
        </div>
      </section>

      {/* Estadísticas Section - Actualizar números según métricas reales */}
      <section className="stats">
        <div className="stats-container">
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="stat-icon" />
            <h3>10,000+</h3>
            <p>Usuarios Activos</p>
          </motion.div>
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Book className="stat-icon" />
            <h3>500+</h3>
            <p>Eventos Realizados</p>
          </motion.div>
          <motion.div 
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Star className="stat-icon" />
            <h3>4.8/5</h3>
            <p>Calificación Promedio</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Personalizar iconos y descripciones según tus servicios */}
      <section className="features">
        <h2 className="features-title">¿Por qué elegir Handin?</h2>
        <div className="feature-grid">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Globe className="feature-icon" />
            <h3 className="feature-title">Acceso Global</h3>
            <p className="feature-description">
              Conéctate a eventos educativos sin importar tu ubicación.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Medal className="feature-icon" />
            <h3 className="feature-title">Certificados Validados</h3>
            <p className="feature-description">
              Obtén certificados digitales con QR para validar tu aprendizaje.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Clock className="feature-icon" />
            <h3 className="feature-title">Modalidades Flexibles</h3>
            <p className="feature-description">
              Disfruta eventos presenciales, en vivo o grabados.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Próximos Eventos Section - Añadir eventos reales */}
      <section className="upcoming-events">
        <h2>Próximos Eventos Destacados</h2>
        <div className="events-grid">
          {/* Añadir 3-4 eventos destacados */}
          <motion.div 
            className="event-card"
            whileHover={{ scale: 1.05 }}
          >
            <img src="/ruta-imagen-evento" alt="Evento 1" />
            <div className="event-details">
              <h3>Nombre del Evento</h3>
              <p>Fecha: DD/MM/YYYY</p>
              <p>Ponente: Nombre del Ponente</p>
              <a href="/evento" className="event-link">Más información</a>
            </div>
          </motion.div>
          {/* Repetir para más eventos */}
        </div>
      </section>

      {/* Testimonios Section - Añadir testimonios reales */}
      <section className="testimonials">
        <h2>Lo que dicen nuestros usuarios</h2>
        <div className="testimonials-grid">
          <motion.div 
            className="testimonial-card"
            whileHover={{ y: -10 }}
          >
            <img src="/ruta-avatar" alt="Usuario" className="testimonial-avatar" />
            <p className="testimonial-text">"Testimonio del usuario"</p>
            <p className="testimonial-author">Nombre del Usuario</p>
            <p className="testimonial-role">Cargo/Profesión</p>
          </motion.div>
          {/* Repetir para más testimonios */}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="cta-title"
        >
          Únete a nuestra comunidad
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="cta-description"
        >
          Miles de profesionales ya confían en Handin para sus capacitaciones.
        </motion.p>
        <motion.a
          href="/register"
          className="cta-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Comienza Ahora
        </motion.a>
      </section>

      {/* Partners Section - Añadir logos de partners reales */}
      <section className="partners">
        <h2>Nuestros Partners</h2>
        <div className="partners-grid">
          {/* Añadir logos de partners */}
          <img src="/ruta-logo-partner" alt="Partner 1" className="partner-logo" />
          {/* Repetir para más partners */}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><a href="/about">Sobre Nosotros</a></li>
              <li><a href="/events">Eventos</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contacto</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contacto</h3>
            <p>Email: contacto@handin.com</p>
            <p>Teléfono: (123) 456-7890</p>
          </div>
          <div className="footer-section">
            <h3>Síguenos</h3>
            {/* Añadir iconos de redes sociales */}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Handin. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;