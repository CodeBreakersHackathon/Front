import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Video,
  PlayCircle,
  Check,
  ArrowRight,
  Building2,
  ChevronDown,
  Star,
  MessageCircle,
  CheckCircle2,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import "./ServicesPage.css";

// Datos de servicios
const services = [
  {
    id: 1,
    title: "Eventos Presenciales",
    description:
      "Capacitación en ubicaciones físicas con expertos en diversos campos.",
    icon: Building2,
    features: [
      "Networking directo",
      "Certificaciones in situ",
      "Materiales exclusivos",
      "Interacción face-to-face",
      "Actividades prácticas",
      "Coffee breaks incluidos",
    ],
    highlight: "Experiencia inmersiva",
  },
  {
    id: 2,
    title: "Eventos en Vivo",
    description:
      "Transmisiones en tiempo real accesibles desde cualquier dispositivo.",
    icon: Video,
    features: [
      "Chat interactivo",
      "Encuestas en tiempo real",
      "Grabación disponible",
      "Soporte técnico 24/7",
      "Material descargable",
      "Certificado digital",
    ],
    highlight: "Interacción en tiempo real",
  },
  {
    id: 3,
    title: "Grabaciones",
    description: "Acceso a contenido educativo grabado, disponible a demanda.",
    icon: PlayCircle,
    features: [
      "Acceso ilimitado",
      "Material didáctico",
      "Certificaciones automáticas",
      "Aprende a tu ritmo",
      "Contenido actualizado",
      "Recursos adicionales",
    ],
    highlight: "Flexibilidad total",
  },
];

// Datos de precios
const pricing = [
  {
    type: "Básico",
    price: "29.99",
    period: "/mes",
    features: [
      "Acceso a grabaciones básicas",
      "Chat de soporte",
      "Certificado digital",
      "1 evento en vivo al mes",
    ],
    recommended: false,
  },
  {
    type: "Pro",
    price: "49.99",
    period: "/mes",
    features: [
      "Todo lo del plan Básico",
      "Eventos presenciales con descuento",
      "Acceso prioritario",
      "3 eventos en vivo al mes",
      "Recursos descargables",
    ],
    recommended: true,
  },
  {
    type: "Enterprise",
    price: "99.99",
    period: "/mes",
    features: [
      "Todo lo del plan Pro",
      "Eventos presenciales ilimitados",
      "Soporte dedicado 24/7",
      "Eventos en vivo ilimitados",
      "Contenido exclusivo",
    ],
    recommended: false,
  },
];

// Testimonios
const testimonials = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    role: "Estudiante de Ingeniería",
    image: "/imagenes/CarlosRuiz.jpg",
    comment:
      "Los eventos en vivo me permitieron interactuar directamente con los ponentes, ¡fue una experiencia increíble!",
    service: "Eventos en Vivo",
    rating: 5,
    date: "Marzo 2024",
  },
  {
    id: 2,
    name: "Ana Martínez",
    role: "Profesional IT",
    image: "/imagenes/AnaMartinez.jpg",
    comment:
      "Acceder a grabaciones me ayudó a aprender en mis horarios libres y mejorar mis habilidades.",
    service: "Grabaciones",
    rating: 5,
    date: "Febrero 2024",
  },
  {
    id: 3,
    name: "María García",
    role: "Gerente de Proyecto",
    image: "/imagenes/MariaGarcia.jpg",
    comment:
      "Los eventos presenciales ofrecen un networking invaluable. He hecho conexiones importantes.",
    service: "Eventos Presenciales",
    rating: 5,
    date: "Marzo 2024",
  },
];

// FAQs
const faqs = [
  {
    question: "¿Qué incluye un evento en vivo?",
    answer:
      "Los eventos en vivo incluyen acceso a la transmisión en tiempo real, chat interactivo, material descargable, grabación posterior y certificado de participación.",
  },
  {
    question: "¿Cuánto tiempo tengo acceso a las grabaciones?",
    answer:
      "Con una suscripción activa, tienes acceso ilimitado a todas las grabaciones. Puedes verlas cuando quieras y cuantas veces necesites.",
  },
  {
    question: "¿Hay soporte técnico durante los eventos en vivo?",
    answer:
      "Sí, contamos con soporte técnico en tiempo real durante todos los eventos en vivo para resolver cualquier inconveniente.",
  },
  {
    question: "¿Los certificados tienen validez internacional?",
    answer:
      "Sí, nuestros certificados son reconocidos internacionalmente y están avalados por instituciones educativas de prestigio.",
  },
];
const ServicesPage = () => {
  // Estados para las diferentes secciones interactivas
  const [activeService, setActiveService] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Hooks para efectos de scroll
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Controlador para el carrusel de testimonios
  const handleTestimonialChange = (index) => {
    setActiveTestimonial(index);
  };

  // Animaciones comunes reutilizables
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <div className="services-page">
      {/* Hero Section */}
      <motion.section
        className="services-page__hero"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="services-page__hero-overlay" />

        {/* Background con efecto parallax */}
        <motion.div
          className="services-page__hero-background"
          style={{
            y: useTransform(scrollY, [0, 300], [0, 150]),
          }}
        >
          <div className="services-page__hero-gradient" />
          {/* Elementos decorativos animados */}
          <motion.div
            className="services-page__hero-shapes"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="services-page__hero-shape"
                style={{
                  rotate: `${i * 120}deg`,
                  transformOrigin: "center",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Contenido principal del Hero */}
        <div className="services-page__hero-content">
          <motion.h1
            className="services-page__hero-title"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Soluciones Educativas
            <motion.span
              className="services-page__hero-highlight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Para Cada Necesidad
            </motion.span>
          </motion.h1>

          <motion.p
            className="services-page__hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Descubre nuestra plataforma integral de aprendizaje que combina
            tecnología de punta con metodologías probadas. Accede a contenido de
            calidad y conéctate con expertos en tu área.
          </motion.p>

          <motion.div
            className="services-page__hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button
              className="services-page__button services-page__button--primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorar Servicios
              <motion.span
                className="services-page__button-icon"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* El resto de las secciones irán aquí */}
      {/* Services Grid Section */}
      <section className="services-page__grid">
        <motion.div className="services-page__section-header" {...fadeInUp}>
          <h2 className="services-page__section-title">Nuestros Servicios</h2>
          <p className="services-page__section-description">
            Elige el formato que mejor se adapte a tu estilo de aprendizaje
          </p>
        </motion.div>

        <div className="services-page__cards-grid">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={`services-page__card ${
                activeService === service.id
                  ? "services-page__card--active"
                  : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.2,
                duration: 0.5,
                ease: "easeOut",
              }}
              onHoverStart={() => setActiveService(service.id)}
              onHoverEnd={() => setActiveService(null)}
            >
              {/* Efecto de gradiente animado */}
              <motion.div
                className="services-page__card-gradient"
                animate={{
                  opacity: activeService === service.id ? 1 : 0,
                  scale: activeService === service.id ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Contenido de la tarjeta */}
              <div className="services-page__card-content">
                {/* Icono con animación */}
                <motion.div
                  className="services-page__card-icon-wrapper"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {React.createElement(service.icon, {
                    size: 32,
                    className: "services-page__card-icon",
                  })}
                </motion.div>

                {/* Título y descripción */}
                <motion.h3
                  className="services-page__card-title"
                  animate={{
                    color:
                      activeService === service.id
                        ? "var(--services-primary-500)"
                        : "var(--services-primary-900)",
                  }}
                >
                  {service.title}
                </motion.h3>

                <p className="services-page__card-description">
                  {service.description}
                </p>

                {/* Lista de características */}
                <div className="services-page__card-features">
                  {service.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      className="services-page__card-feature"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: idx * 0.1,
                        duration: 0.3,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        className="services-page__feature-icon-wrapper"
                      >
                        <Check className="services-page__feature-icon" />
                      </motion.div>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Badge destacado */}
                <motion.div
                  className="services-page__card-highlight"
                  animate={{
                    scale: activeService === service.id ? 1.05 : 1,
                    backgroundColor:
                      activeService === service.id
                        ? "var(--services-primary-500)"
                        : "var(--services-primary-50)",
                    color:
                      activeService === service.id
                        ? "white"
                        : "var(--services-primary-600)",
                  }}
                >
                  {service.highlight}
                </motion.div>

                {/* Botón de acción */}
                <motion.button
                  className="services-page__card-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explorar más
                  <motion.div
                    className="services-page__card-button-icon"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Elementos decorativos flotantes */}
        <div className="services-page__grid-decoration">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="services-page__grid-shape"
              animate={{
                y: [0, 20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                delay: i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="services-page__testimonials">
        <motion.div className="services-page__section-header" {...fadeInUp}>
          <h2 className="services-page__section-title">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="services-page__section-description">
            Experiencias reales de nuestra comunidad educativa
          </p>
        </motion.div>

        <div className="services-page__testimonials-container">
          {/* Slider principal */}
          <motion.div
            className="services-page__testimonials-slider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="services-page__testimonials-track"
              drag="x"
              dragConstraints={{ right: 0, left: -1200 }}
              dragElastic={0.2}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className={`services-page__testimonial-card ${
                    activeTestimonial === index
                      ? "services-page__testimonial-card--active"
                      : ""
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Comillas decorativas */}
                  <motion.div
                    className="services-page__testimonial-quotes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ delay: 0.5 }}
                  >
                    "
                  </motion.div>

                  <div className="services-page__testimonial-content">
                    {/* Imagen y detalles del usuario */}
                    <div className="services-page__testimonial-header">
                      <motion.div
                        className="services-page__testimonial-image-wrapper"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="services-page__testimonial-image"
                        />
                      </motion.div>
                      <div className="services-page__testimonial-info">
                        <h4 className="services-page__testimonial-name">
                          {testimonial.name}
                        </h4>
                        <p className="services-page__testimonial-role">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Comentario */}
                    <motion.p
                      className="services-page__testimonial-comment"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      {testimonial.comment}
                    </motion.p>

                    {/* Pie del testimonial */}
                    <div className="services-page__testimonial-footer">
                      {/* Rating */}
                      <div className="services-page__testimonial-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star
                              className="services-page__testimonial-star"
                              fill="currentColor"
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Servicio y fecha */}
                      <div className="services-page__testimonial-meta">
                        <span className="services-page__testimonial-service">
                          {testimonial.service}
                        </span>
                        <span className="services-page__testimonial-date">
                          {testimonial.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Controles de navegación */}
          <div className="services-page__testimonials-controls">
            <motion.button
              className="services-page__testimonials-arrow services-page__testimonials-arrow--prev"
              onClick={() => {
                const newIndex =
                  activeTestimonial === 0
                    ? testimonials.length - 1
                    : activeTestimonial - 1;
                setActiveTestimonial(newIndex);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight />
            </motion.button>

            <div className="services-page__testimonials-indicators">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`services-page__testimonials-indicator ${
                    activeTestimonial === index
                      ? "services-page__testimonials-indicator--active"
                      : ""
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  animate={{
                    backgroundColor:
                      activeTestimonial === index
                        ? "var(--services-primary-500)"
                        : "var(--services-primary-200)",
                  }}
                />
              ))}
            </div>

            <motion.button
              className="services-page__testimonials-arrow services-page__testimonials-arrow--next"
              onClick={() => {
                const newIndex =
                  activeTestimonial === testimonials.length - 1
                    ? 0
                    : activeTestimonial + 1;
                setActiveTestimonial(newIndex);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight />
            </motion.button>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="services-page__faq">
        <motion.div className="services-page__section-header" {...fadeInUp}>
          <h2 className="services-page__section-title">Preguntas Frecuentes</h2>
          <p className="services-page__section-description">
            Encuentra respuestas a las dudas más comunes sobre nuestros
            servicios
          </p>
        </motion.div>

        <div className="services-page__faq-grid">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`services-page__faq-item ${
                activeFaq === index ? "services-page__faq-item--active" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                className="services-page__faq-question"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                aria-expanded={activeFaq === index}
              >
                <motion.span
                  animate={{
                    color:
                      activeFaq === index
                        ? "var(--services-primary-500)"
                        : "var(--services-primary-900)",
                  }}
                >
                  {faq.question}
                </motion.span>
                <motion.div
                  className="services-page__faq-icon"
                  animate={{
                    rotate: activeFaq === index ? 180 : 0,
                    color:
                      activeFaq === index
                        ? "var(--services-primary-500)"
                        : "var(--services-primary-600)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown />
                </motion.div>
              </button>

              <motion.div
                className="services-page__faq-answer"
                initial={false}
                animate={{
                  height: activeFaq === index ? "auto" : 0,
                  opacity: activeFaq === index ? 1 : 0,
                }}
                transition={{
                  height: {
                    duration: 0.3,
                    ease: "easeInOut",
                  },
                  opacity: {
                    duration: 0.2,
                    delay: activeFaq === index ? 0.1 : 0,
                  },
                }}
              >
                <motion.div
                  className="services-page__faq-answer-content"
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{faq.answer}</p>
                </motion.div>
              </motion.div>

              {/* Línea decorativa animada */}
              <motion.div
                className="services-page__faq-line"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: activeFaq === index ? 1 : 0,
                  backgroundColor:
                    activeFaq === index
                      ? "var(--services-primary-500)"
                      : "var(--services-primary-100)",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Soporte adicional */}
        <motion.div
          className="services-page__faq-support"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>¿No encontraste lo que buscabas?</p>
          <motion.button
            className="services-page__faq-support-button"
            whileHover={{
              scale: 1.05,
              backgroundColor: "var(--services-primary-600)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Contacta con soporte
            <motion.div
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <MessageCircle className="services-page__faq-support-icon" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Elementos decorativos */}
        <div className="services-page__faq-decoration">
          <motion.div
            className="services-page__faq-shape"
            animate={{
              y: [0, 20, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>
      {/* CTA Section */}
      <section className="services-page__cta">
        {/* Fondo con gradiente animado */}
        <div className="services-page__cta-background">
          <motion.div
            className="services-page__cta-gradient"
            animate={{
              background: [
                "linear-gradient(45deg, var(--services-primary-600) 0%, var(--services-primary-500) 100%)",
                "linear-gradient(225deg, var(--services-primary-500) 0%, var(--services-primary-600) 100%)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        </div>

        {/* Patrón de fondo animado */}
        <motion.div
          className="services-page__cta-pattern"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        />

        {/* Elementos decorativos flotantes */}
        <div className="services-page__cta-decoration">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="services-page__cta-shape"
              animate={{
                y: [0, 20, 0],
                rotate: [0, 360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                delay: i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Contenido principal*/}
        <motion.div
          className="services-page__cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Título principal con animación */}
          <motion.h2
            className="services-page__cta-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Comienza tu Viaje de&nbsp;
            <motion.span
              className="services-page__cta-highlight"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Aprendizaje Hoy
            </motion.span>
          </motion.h2>

          {/* Descripción */}
          <motion.p
            className="services-page__cta-description"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Únete a nuestra comunidad y transforma tu futuro con educación de
            calidad.
          </motion.p>

          {/* Botones principales */}
          <motion.div
            className="services-page__cta-buttons-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              className="services-page__cta-button services-page__cta-button--primary"
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 8px 20px rgba(33, 150, 243, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Comenzar Ahora
              <motion.span
                className="services-page__cta-button-icon"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight />
              </motion.span>
            </motion.button>

            <motion.button
              className="services-page__cta-button services-page__cta-button--secondary"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Más
            </motion.button>
          </motion.div>

          {/* Redes sociales con animación */}
          <motion.div
            className="services-page__cta-social"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <p className="services-page__cta-social-title">
              Síguenos en redes sociales
            </p>
            <div className="services-page__cta-social-icons">
              {[Facebook, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="services-page__cta-social-icon"
                  whileHover={{
                    scale: 1.3,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default ServicesPage;
