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
  CheckCircle2
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para manejar la animación de aparición al scroll
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observerOptions = {
      threshold: 0.1
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

      {/* Hero Section */}
      <section className="hero">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="hero-video"
          poster="/images/hero-poster.jpg" // Asegúrate de tener esta imagen en public/images/
        >
          <source 
            src="/videos/hero-background.mp4" // El video debe estar en public/videos/
            type="video/mp4"
          />
          {/* Fallback para navegadores que no soportan video */}
          Tu navegador no soporta el elemento video.
        </video>
        <div className="hero-overlay">
          <div className="container mx-auto px-4 py-20">
            <h1 className="hero-title">HANDIN</h1>
            <h2 className="hero-subtitle">Conectamos conocimiento</h2>
            <p className="hero-description">
              Accede a eventos educativos desde cualquier lugar, en vivo o grabados.
            </p>
            <form className="hero-form max-w-md mx-auto">
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

      {/* Beneficios Section */}
      <section className="beneficios py-20 bg-[#f1f9fe]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#134a67] reveal fade-in-up">
            ¿Por qué elegir HANDIN?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe size={32} />,
                title: "Alcance Global",
                description: "Conecta con estudiantes y profesionales de todo el mundo"
              },
              {
                icon: <Medal size={32} />,
                title: "Certificaciones",
                description: "Obtén certificados validados por expertos"
              },
              {
                icon: <Clock size={32} />,
                title: "Flexibilidad",
                description: "Aprende a tu propio ritmo y horario"
              },
              {
                icon: <CheckCircle2 size={32} />,
                title: "Calidad",
                description: "Contenido verificado y actualizado"
              }
            ].map((beneficio, index) => (
              <div 
                key={index} 
                className="beneficio-card p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 reveal"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-[#21aae1] mb-4 beneficio-icon">
                  {beneficio.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#134a67]">
                  {beneficio.title}
                </h3>
                <p className="text-[#10597c]">{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas Section */}
      <section className="stat-container py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#134a67] reveal fade-in-up">
            Nuestro Impacto
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12 text-[#21aae1]" />,
                number: "10,000+",
                label: "Usuarios Activos"
              },
              {
                icon: <Book className="w-12 h-12 text-[#21aae1]" />,
                number: "500+",
                label: "Eventos Realizados"
              },
              {
                icon: <Star className="w-12 h-12 text-[#21aae1]" />,
                number: "4.8/5",
                label: "Calificación Promedio"
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="stat-item reveal"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {stat.icon}
                <div className="stat-number">{stat.number}</div>
                <p className="text-[#10597c]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="py-20 bg-[#e2f3fc]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#134a67] reveal fade-in-up">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María García",
                role: "Estudiante",
                comment: "HANDIN ha transformado mi forma de aprender. Los eventos son increíbles."
              },
              {
                name: "Carlos Ruiz",
                role: "Profesional",
                comment: "La flexibilidad y calidad del contenido son excepcionales."
              },
              {
                name: "Ana Martínez",
                role: "Docente",
                comment: "Una plataforma que realmente conecta el conocimiento global."
              }
            ].map((testimonio, index) => (
              <div 
                key={index}
                className="testimonio-card bg-white p-6 rounded-xl shadow-sm reveal"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src="/api/placeholder/40/40"
                    alt={testimonio.name}
                    className="testimonio-avatar w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-[#134a67]">{testimonio.name}</h4>
                    <p className="text-[#10597c]">{testimonio.role}</p>
                  </div>
                </div>
                <p className="text-[#10597c]">{testimonio.comment}</p>
                <div className="flex text-[#21aae1] mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white reveal fade-in-up">
            Empieza a transformar tu aprendizaje ahora
          </h2>
          <p className="text-xl text-white mb-8 reveal fade-in-up" style={{ animationDelay: '0.2s' }}>
            Únete a nuestra comunidad global de aprendizaje
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-[#21aae1] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 reveal fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Crear cuenta gratuita
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sobre HANDIN</h3>
              <p className="text-gray-300">
                Transformando la educación a través de eventos en línea de alta calidad.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="footer-link text-gray-300">Políticas de privacidad</a>
                </li>
                <li>
                  <a href="#" className="footer-link text-gray-300">Términos y condiciones</a>
                </li>
                <li>
                  <a href="#" className="footer-link text-gray-300">Contacto</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900"
                />
                <button className="bg-[#21aae1] hover:bg-[#1084b9] px-4 py-2 rounded-r-lg transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 HANDIN. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;