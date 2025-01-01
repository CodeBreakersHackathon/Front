import React, { useEffect, useState } from 'react';
import { 
  Globe, 
  Medal, 
  Clock, 
  Users, 
  Book, 
  Star, 
  Facebook, 
  Linkedin, 
  Instagram,
  ChevronRight,
  Mail,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Play,
  Video,
  Tag
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Datos de eventos
  const eventos = [
    {
      id: 1,
      imagen: "/imagenes/EDUCACION.jpg",
      categoria: "Educación",
      titulo: "Innovación en la Enseñanza Digital",
      fecha: "15 Marzo 2024",
      estado: "Próximo",
      instructor: "Dr. Juan Pérez",
      participantes: 150,
      descripcion: "Descubre las últimas tendencias en educación digital."
    },
    {
      id: 2,
      imagen: "/imagenes/SALUD.jpg",
      categoria: "Salud",
      titulo: "Avances en Telemedicina",
      fecha: "20 Marzo 2024",
      estado: "En vivo",
      instructor: "Dra. María López",
      participantes: 200,
      descripcion: "Exploraremos el futuro de la medicina a distancia."
    },
    {
      id: 3,
      imagen: "/imagenes/INTELIGENCIA ARTIFICIAL.svg",
      categoria: "Tecnología",
      titulo: "Inteligencia Artificial en 2024",
      fecha: "25 Marzo 2024",
      estado: "Grabado",
      instructor: "Ing. Carlos Ruiz",
      participantes: 300,
      descripcion: "Un viaje por las últimas innovaciones en IA."
    }
  ];

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer para animaciones
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <div className="home-container">
      {/* Header */}
      <header className={`header fixed w-full z-50 ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img src="/api/placeholder/50/50" alt="HANDIN Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold gradient-text">HANDIN</span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="nav-link text-gray-900">Inicio</a>
            <a href="/nosotros" className="nav-link text-gray-900">Nosotros</a>
            <a href="/servicios" className="nav-link text-gray-900">Servicios</a>
            <a href="/contacto" className="nav-link text-gray-900">Contacto</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-gray-900 hover:text-[#21aae1] transition-colors">
              Iniciar Sesión
            </a>
            <a 
              href="/register" 
              className="bg-[#21aae1] hover:bg-[#1084b9] text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Registrarse
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section Mejorado */}
      <section className="hero">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="hero-video"
          poster="/imagenes/hero-poster.jpg"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento video.
        </video>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title reveal fade-in">HANDIN</h1>
            <h2 className="hero-subtitle reveal fade-in">Conectamos conocimiento</h2>
            <p className="hero-description reveal fade-in">
              Accede a eventos educativos desde cualquier lugar, en vivo o grabados.
            </p>
            <form className="hero-form reveal fade-in">
              <div className="hero-form-container">
                <input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  className="hero-input"
                  required
                />
                <button 
                  type="submit"
                  className="hero-button"
                >
                  Comenzar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
{/* Beneficios Section Mejorada */}
<section className="beneficios">
        <div className="container mx-auto px-4">
          <h2 className="beneficios-title reveal fade-in-up">
            ¿Por qué elegir HANDIN?
          </h2>
          <div className="beneficios-grid">
            {[
              {
                icon: <Globe size={32} />,
                title: "Alcance Global",
                description: "Conecta con estudiantes y profesionales de todo el mundo",
                color: "#21aae1"
              },
              {
                icon: <Medal size={32} />,
                title: "Certificaciones",
                description: "Obtén certificados validados por expertos",
                color: "#1084b9"
              },
              {
                icon: <Clock size={32} />,
                title: "Flexibilidad",
                description: "Aprende a tu propio ritmo y horario",
                color: "#0e6996"
              },
              {
                icon: <CheckCircle2 size={32} />,
                title: "Calidad",
                description: "Contenido verificado y actualizado",
                color: "#10597c"
              }
            ].map((beneficio, index) => (
              <div 
                key={index} 
                className="beneficio-card reveal"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="beneficio-icon-wrapper">
                  <div className="beneficio-icon" style={{ color: beneficio.color }}>
                    {beneficio.icon}
                  </div>
                </div>
                <h3 className="beneficio-title">
                  {beneficio.title}
                </h3>
                <p className="beneficio-description">
                  {beneficio.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nueva Sección de Eventos */}
      <section className="eventos-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title reveal fade-in-up">
            Eventos Destacados
          </h2>
          
          {/* Filtros de Eventos */}
          <div className="eventos-filters reveal fade-in">
            <button 
              className={`filter-button ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Todos
            </button>
            {['Educación', 'Salud', 'Tecnología'].map((cat) => (
              <button
                key={cat}
                className={`filter-button ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Eventos */}
          <div className="eventos-grid">
            {eventos
              .filter(evento => 
                activeCategory === 'all' || evento.categoria === activeCategory
              )
              .map((evento, index) => (
                <div 
                  key={evento.id}
                  className="evento-card reveal"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="evento-image-container">
                    <img 
                      src={evento.imagen}
                      alt={evento.titulo}
                      className="evento-image"
                    />
                    <div className={`evento-estado ${evento.estado.toLowerCase().replace(' ', '-')}`}>
                      {evento.estado === 'En vivo' && <Play size={16} />}
                      {evento.estado === 'Grabado' && <Video size={16} />}
                      {evento.estado === 'Próximo' && <Play size={16} />}
                      {evento.estado}
                    </div>
                  </div>
                  
                  <div className="evento-content">
                    <div className="evento-categoria">
                      <Tag size={16} />
                      <span>{evento.categoria}</span>
                    </div>
                    
                    <h3 className="evento-titulo">{evento.titulo}</h3>
                    
                    <div className="evento-detalles">
                      <div className="evento-instructor">
                        <span>Por {evento.instructor}</span>
                      </div>
                      <div className="evento-fecha">
                        <Calendar size={16} />
                        <span>{evento.fecha}</span>
                      </div>
                    </div>
                    
                    <p className="evento-descripcion">
                      {evento.descripcion}
                    </p>
                    
                    <div className="evento-footer">
                      <span className="evento-participantes">
                        <Users size={16} />
                        {evento.participantes} participantes
                      </span>
                      <button className="evento-button">
                        Inscribirse
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Botón Ver Más Eventos */}
          <div className="eventos-footer reveal fade-in">
            <a href="/eventos" className="ver-mas-button">
              Ver todos los eventos
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>
{/* Estadísticas Section Mejorada */}
<section className="stats-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title reveal fade-in-up">
            Nuestro Impacto
          </h2>
          
          <div className="stats-grid">
            {[
              {
                icon: <Users className="stat-icon" />,
                number: "10,000+",
                label: "Usuarios Activos",
                description: "Estudiantes y profesionales activos en nuestra plataforma",
                increment: "↑ 25% este mes"
              },
              {
                icon: <Book className="stat-icon" />,
                number: "500+",
                label: "Eventos Realizados",
                description: "Eventos de alta calidad completados exitosamente",
                increment: "↑ 15% este mes"
              },
              {
                icon: <Star className="stat-icon" />,
                number: "4.8/5",
                label: "Calificación Promedio",
                description: "Basado en más de 2,000 reseñas de usuarios",
                increment: "↑ 0.3 este mes"
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="stat-item reveal"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="stat-icon-wrapper">
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <div className="stat-number-container">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-increment">{stat.increment}</span>
                  </div>
                  <h3 className="stat-label">{stat.label}</h3>
                  <p className="stat-description">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios Section Mejorada */}
      <section className="testimonios-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title reveal fade-in-up">
            Lo que dicen nuestros usuarios
          </h2>

          <div className="testimonios-grid">
            {[
              {
                name: "María García",
                role: "Estudiante de Medicina",
                image: "/imagenes/MariaGarcia.svg",
                comment: "HANDIN ha transformado mi forma de aprender. Los eventos son increíbles y la calidad del contenido supera mis expectativas.",
                rating: 5,
                date: "Febrero 2024",
                eventosAsistidos: 12
              },
              {
                name: "Carlos Ruiz",
                role: "Profesional IT",
                image: "/imagenes/CarlosRuiz.svg",
                comment: "La flexibilidad y calidad del contenido son excepcionales. He podido mejorar mis habilidades mientras mantengo mi trabajo.",
                rating: 5,
                date: "Enero 2024",
                eventosAsistidos: 8
              },
              {
                name: "Ana Martínez",
                role: "Docente Universitaria",
                image: "/imagenes/AnaMartinez.svg",
                comment: "Una plataforma que realmente conecta el conocimiento global. La interacción con expertos internacionales es invaluable.",
                rating: 5,
                date: "Marzo 2024",
                eventosAsistidos: 15
              }
            ].map((testimonio, index) => (
              <div 
                key={index}
                className="testimonio-card reveal"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="testimonio-header">
                  <div className="testimonio-avatar-container">
                    <img
                      src={testimonio.image}
                      alt={testimonio.name}
                      className="testimonio-avatar"
                    />
                    <div className="testimonio-eventos-badge">
                      {testimonio.eventosAsistidos} eventos
                    </div>
                  </div>
                  <div className="testimonio-info">
                    <h3 className="testimonio-name">{testimonio.name}</h3>
                    <p className="testimonio-role">{testimonio.role}</p>
                    <div className="testimonio-date">{testimonio.date}</div>
                  </div>
                </div>

                <div className="testimonio-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`testimonio-star ${i < testimonio.rating ? 'active' : ''}`}
                    />
                  ))}
                </div>

                <blockquote className="testimonio-content">
                  "{testimonio.comment}"
                </blockquote>

                <div className="testimonio-footer">
                  <div className="testimonio-verified">
                    <CheckCircle2 size={16} />
                    Usuario verificado
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Llamado a la acción dentro de testimonios */}
          <div className="testimonios-cta reveal fade-in">
            <h3>¿Listo para unirte a nuestra comunidad?</h3>
            <p>Únete a miles de estudiantes y profesionales que ya están transformando su aprendizaje</p>
            <button className="testimonios-cta-button">
              Comenzar ahora
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
{/* CTA Section Principal Mejorada */}
<section className="cta-section">
        <div className="cta-background-effects">
          <div className="cta-particles"></div>
          <div className="cta-gradient"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="cta-content reveal fade-in">
            <h2 className="cta-title">
              Empieza a transformar tu aprendizaje ahora
            </h2>
            <p className="cta-description">
              Únete a nuestra comunidad global de aprendizaje y accede a eventos exclusivos
            </p>
            
            <div className="cta-features">
              {[
                { icon: <Users size={24} />, text: "Comunidad global" },
                { icon: <Video size={24} />, text: "Eventos en vivo y grabados" },
                { icon: <Medal size={24} />, text: "Certificaciones validadas" }
              ].map((feature, index) => (
                <div key={index} className="cta-feature">
                  {feature.icon}
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="cta-buttons">
              <a href="/register" className="cta-button-primary">
                Crear cuenta gratuita
                <ArrowRight size={20} />
              </a>
              <a href="/eventos" className="cta-button-secondary">
                Explorar eventos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="footer">
        <div className="footer-content">
          <div className="container mx-auto px-4">
            {/* Grid Principal */}
            <div className="footer-grid">
              {/* Columna de Información */}
              <div className="footer-section reveal fade-in">
                <div className="footer-brand">
                  <img src="/imagenes/logo.svg" alt="HANDIN Logo" className="footer-logo" />
                  <h3 className="footer-brand-name">HANDIN</h3>
                </div>
                <p className="footer-description">
                  Transformando la educación a través de eventos en línea de alta calidad.
                  Conectamos conocimiento globalmente.
                </p>
                <div className="footer-social">
                  {[
                    { icon: <Facebook size={20} />, link: "#", name: "Facebook" },
                    { icon: <Linkedin size={20} />, link: "#", name: "LinkedIn" },
                    { icon: <Instagram size={20} />, link: "#", name: "Instagram" }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href={social.link}
                      className="footer-social-link"
                      aria-label={`Síguenos en ${social.name}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Columna de Enlaces Rápidos */}
              <div className="footer-section reveal fade-in">
                <h3 className="footer-title">Navegación</h3>
                <ul className="footer-links">
                  <li><a href="/eventos">Eventos</a></li>
                  <li><a href="/nosotros">Sobre Nosotros</a></li>
                  <li><a href="/instructores">Instructores</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/contacto">Contacto</a></li>
                </ul>
              </div>

              {/* Columna Legal */}
              <div className="footer-section reveal fade-in">
                <h3 className="footer-title">Legal</h3>
                <ul className="footer-links">
                  <li><a href="/privacidad">Políticas de privacidad</a></li>
                  <li><a href="/terminos">Términos y condiciones</a></li>
                  <li><a href="/cookies">Política de cookies</a></li>
                  <li><a href="/faq">FAQ</a></li>
                </ul>
              </div>

              {/* Columna Newsletter */}
              <div className="footer-section reveal fade-in">
                <h3 className="footer-title">Newsletter</h3>
                <p className="footer-newsletter-text">
                  Suscríbete para recibir actualizaciones sobre nuevos eventos y contenido exclusivo.
                </p>
                <form className="footer-newsletter-form">
                  <div className="newsletter-input-group">
                    <input
                      type="email"
                      placeholder="Tu correo electrónico"
                      className="newsletter-input"
                      required
                    />
                    <button 
                      type="submit" 
                      className="newsletter-button"
                      aria-label="Suscribirse al newsletter"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <p className="footer-copyright">
                  &copy; {new Date().getFullYear()} HANDIN. Todos los derechos reservados.
                </p>
                <div className="footer-bottom-links">
                  <a href="/mapa-sitio">Mapa del sitio</a>
                  <a href="/accesibilidad">Accesibilidad</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;