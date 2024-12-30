import React from "react";
import { motion } from "framer-motion";
import { Globe, Award, Calendar, Users, Book, Clock, Medal, Star } from 'lucide-react';
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero" transition-style="in:diamond:hesitate">
        <div className="hero-content">
          {/* Título principal dividido */}
          <motion.h1
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="hero-title"
          >
            HANDIN
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-subtitle"
          >
            Conectamos conocimiento
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
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

{/* Estadísticas Section */}
<motion.section
  className="stats"
  transition-style="in:wipe:right"
  initial={{ clipPath: "inset(0 100% 0 0)" }}
  whileInView={{ clipPath: "inset(0 0 0 0)" }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 2.5, ease: [0.25, 1, 0.3, 1] }}
>
  <div className="stats-container">
    <motion.div
      className="stat-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <Users className="stat-icon" />
      <h3>10,000+</h3>
      <p>Usuarios Activos</p>
    </motion.div>
    <motion.div
      className="stat-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Book className="stat-icon" />
      <h3>500+</h3>
      <p>Eventos Realizados</p>
    </motion.div>
    <motion.div
      className="stat-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Star className="stat-icon" />
      <h3>4.8/5</h3>
      <p>Calificación Promedio</p>
    </motion.div>
  </div>
</motion.section>


      {/* Features Section */}
<motion.section
  className="features"
  transition-style="in:wipe:right"
  initial={{ clipPath: "inset(0 100% 0 0)" }}
  whileInView={{ clipPath: "inset(0 0 0 0)" }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 2.5, ease: [0.25, 1, 0.3, 1] }}
>
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
</motion.section>


      {/* Próximos Eventos */}
      <section className="upcoming-events">
        <h2>Próximos Eventos Destacados</h2>
        <div className="events-grid">
          <motion.div 
            className="event-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="event-details">
              <h3>Nombre del Evento</h3>
              <p>Fecha: DD/MM/YYYY</p>
              <p>Ponente: Nombre del Ponente</p>
              <a href="/evento" className="event-link">Más información</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Handin. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
