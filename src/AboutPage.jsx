import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  Lightbulb,
  GraduationCap,
  Globe,
  Target,
  Heart,
  Puzzle,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import "./AboutPage.css";

// Componente para los números animados
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrameId;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  return <span className="optimize-animation">{count.toLocaleString()}+</span>;
};

// Componente para las tarjetas de estadísticas
const StatCard = ({ icon: Icon, value, label }) => {
  return (
    <motion.div
      className="stat-card hardware-accelerated"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="stat-icon">
        <Icon size={32} />
      </div>
      <div className="stat-content">
        <h3 className="stat-value">
          <AnimatedCounter value={value} />
        </h3>
        <p className="stat-label">{label}</p>
      </div>
    </motion.div>
  );
};
// Datos de estadísticas
const stats = [
  { icon: Users, value: 50000, label: "Usuarios Activos" },
  { icon: GraduationCap, value: 1000, label: "Eventos Realizados" },
  { icon: Globe, value: 120, label: "Países Alcanzados" },
  { icon: Award, value: 95, label: "Satisfacción %" },
];

// Datos del timeline
const timeline = [
  {
    year: "2020",
    title: "Fundación de Handin",
    description:
      "Comenzamos con la visión de democratizar la educación digital.",
  },
  {
    year: "2021",
    title: "Expansión Global",
    description: "Alcanzamos presencia en más de 50 países.",
  },
  {
    year: "2022",
    title: "Innovación Tecnológica",
    description:
      "Implementamos IA para personalizar la experiencia de aprendizaje.",
  },
  {
    year: "2023",
    title: "Comunidad Global",
    description: "Superamos los 50,000 usuarios activos.",
  },
];

function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <motion.div
            className="hero-shape hardware-accelerated"
            style={{ scale }}
          />
        </div>

        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title" variants={itemVariants}>
            Transformando la &nbsp;
            <span className="text-gradient"> Educación Digital</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={itemVariants}>
            Conectando personas con conocimiento a través de la tecnología
          </motion.p>

          <motion.div className="hero-stats" variants={containerVariants}>
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Sección de Misión y Visión */}
      <section className="mission-vision-section">
        <div className="section-grid">
          <motion.div
            className="mission-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="card-icon">
              <Target size={40} />
            </div>
            <h2>Nuestra Misión</h2>
            <p>
              Democratizar el acceso al conocimiento mediante una plataforma
              innovadora que conecte a expertos con estudiantes de todo el
              mundo, facilitando el aprendizaje continuo y el desarrollo
              profesional.
            </p>
          </motion.div>

          <motion.div
            className="vision-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="card-icon">
              <Lightbulb size={40} />
            </div>
            <h2>Nuestra Visión</h2>
            <p>
              Ser la plataforma líder global en educación digital,
              revolucionando la manera en que las personas aprenden y se
              conectan, creando un impacto positivo en la sociedad a través del
              conocimiento compartido.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Sección de Valores */}
      <section className="values-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Nuestros Valores
        </motion.h2>

        <div className="values-grid">
          <motion.div
            className="value-card"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            viewport={{ once: true }}
          >
            <Heart className="value-icon" />
            <h3>Pasión por la Educación</h3>
            <p>
              Creemos en el poder transformador del conocimiento y su capacidad
              para cambiar vidas.
            </p>
          </motion.div>

          <motion.div
            className="value-card"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Puzzle className="value-icon" />
            <h3>Innovación Constante</h3>
            <p>
              Buscamos continuamente nuevas formas de mejorar la experiencia de
              aprendizaje.
            </p>
          </motion.div>

          <motion.div
            className="value-card"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Globe className="value-icon" />
            <h3>Accesibilidad Global</h3>
            <p>
              Trabajamos para hacer la educación accesible para todos, sin
              importar su ubicación.
            </p>
          </motion.div>

          <motion.div
            className="value-card"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Users className="value-icon" />
            <h3>Comunidad Colaborativa</h3>
            <p>
              Fomentamos un ambiente de aprendizaje colaborativo y de apoyo
              mutuo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Nuestra Historia
        </motion.h2>

        <div className="timeline">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="timeline-content">
                <div className="timeline-dot" />
                <span className="timeline-year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Impact Section */}
      <section className="impact-section">
        <motion.div
          className="impact-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Nuestro Impacto</h2>
          <div className="impact-grid">
            <motion.div className="impact-card" whileHover={{ scale: 1.05 }}>
              <BookOpen className="impact-icon" />
              <h3>
                <AnimatedCounter value={1000} />
                <span>Cursos</span>
              </h3>
              <p>Eventos educativos realizados exitosamente</p>
            </motion.div>

            <motion.div className="impact-card" whileHover={{ scale: 1.05 }}>
              <Users className="impact-icon" />
              <h3>
                <AnimatedCounter value={50000} />
                <span>Estudiantes</span>
              </h3>
              <p>Aprendices activos en nuestra plataforma</p>
            </motion.div>

            <motion.div className="impact-card" whileHover={{ scale: 1.05 }}>
              <GraduationCap className="impact-icon" />
              <h3>
                <AnimatedCounter value={500} />
                <span>Expertos</span>
              </h3>
              <p>Instructores certificados compartiendo conocimiento</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="about-cta">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="cta-title">Únete a Nuestra Comunidad Global</h2>
          <p className="cta-description">
            Sé parte de una comunidad comprometida con la excelencia en la
            educación digital
          </p>
          <div className="cta-features">
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle2 className="feature-icon" />
              <span>Acceso a eventos exclusivos</span>
            </motion.div>
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <CheckCircle2 className="feature-icon" />
              <span>Networking global</span>
            </motion.div>
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle2 className="feature-icon" />
              <span>Certificaciones reconocidas</span>
            </motion.div>
          </div>
          <motion.a
            href="/register"
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Comienza tu viaje ahora <ArrowRight className="button-icon" />
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}

export default AboutPage;
